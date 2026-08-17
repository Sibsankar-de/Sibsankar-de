"use client";

import { useState, useRef, useTransition } from "react";
import { toast } from "sonner";
import type { ProjectImage, ProjectSocialPost, PublicProject } from "@/server/projects/types";
import { uploadImagesAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

type EditableProject = PublicProject & { isPublished?: boolean; sortOrder?: number };

interface ImageItem extends ProjectImage {
  priority: number;
}

const COMMON_TECH_SUGGESTIONS = [
  "Next.js",
  "React",
  "Node.js",
  "Spring Boot",
  "TypeScript",
  "Java",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "AWS",
  "RabbitMQ",
  "Tailwind CSS",
  "Elasticsearch",
  "WebSocket",
  "LangChain",
];

const PLATFORM_OPTIONS = ["LinkedIn", "Twitter / X", "Reddit", "Dev.to", "YouTube", "Medium", "ProductHunt", "GitHub"];

export function AdminProjectForm({
  action,
  project,
}: {
  action: (prevState: ActionState | void | undefined, formData: FormData) => Promise<ActionState | void> | ActionState | void;
  project?: EditableProject;
}) {
  const label = project ? "Update project" : "Create project";

  // Controlled form state (never resets on validation errors)
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [body, setBody] = useState(project?.body ?? "");
  const [sortOrder, setSortOrder] = useState<number>(project?.sortOrder ?? 0);
  const [sourceUrl, setSourceUrl] = useState(project?.sourceUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl ?? "");
  const [isPublished, setIsPublished] = useState<boolean>(project?.isPublished ?? true);

  // State for images
  const [images, setImages] = useState<ImageItem[]>(() => {
    const raw = project?.images ?? [];
    return raw.map((img, idx) => ({
      ...img,
      priority: typeof img.priority === "number" ? img.priority : idx,
    }));
  });

  // State for tech stack
  const [stack, setStack] = useState<string[]>(project?.stack ?? []);
  const [tagInput, setTagInput] = useState("");

  // State for social posts
  const [socialPosts, setSocialPosts] = useState<ProjectSocialPost[]>(project?.socialPosts ?? []);
  const [platform, setPlatform] = useState("LinkedIn");
  const [customPlatform, setCustomPlatform] = useState("");
  const [postUrl, setPostUrl] = useState("");

  const [isPending, startTransition] = useTransition();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const [manualPublicId, setManualPublicId] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to reassign priority sequentially after any order change
  const updatePriorities = (newList: Omit<ImageItem, "priority">[]): ImageItem[] => {
    return newList.map((item, index) => ({
      ...item,
      priority: index,
    }));
  };

  // Stack handlers
  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (!stack.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setStack((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setStack((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  // Social post handlers
  const handleAddSocialPost = () => {
    const selectedPlatform = platform === "Other" ? customPlatform.trim() : platform;
    const url = postUrl.trim();

    if (!selectedPlatform || !url) {
      toast.error("Please provide both platform name and post URL.");
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL for the social post.");
      return;
    }

    setSocialPosts((prev) => [...prev, { platform: selectedPlatform, url }]);
    setPostUrl("");
    if (platform === "Other") setCustomPlatform("");
  };

  const handleRemoveSocialPost = (index: number) => {
    setSocialPosts((prev) => prev.filter((_, i) => i !== index));
  };

  // Image handlers
  const handleFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f && f.size > 0 && f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        for (const file of fileArray) {
          formData.append("files", file);
        }
        const uploadedResults = await uploadImagesAction(formData);

        setImages((prev) =>
          updatePriorities([
            ...prev,
            ...uploadedResults.map((r) => ({
              image_url: r.image_url,
              public_id: r.public_id,
            })),
          ]),
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success(`Successfully uploaded ${uploadedResults.length} image(s).`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Image upload failed.");
      }
    });
  };

  const handleAddManualImage = () => {
    if (!manualUrl.trim()) return;
    try {
      new URL(manualUrl.trim());
    } catch {
      toast.error("Please enter a valid image URL.");
      return;
    }
    const pubId = manualPublicId.trim() || `manual-${Date.now()}`;
    setImages((prev) => updatePriorities([...prev, { image_url: manualUrl.trim(), public_id: pubId }]));
    setManualUrl("");
    setManualPublicId("");
    setShowManualInput(false);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => updatePriorities(prev.filter((_, i) => i !== index)));
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setImages(updatePriorities(updated));
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    handleMove(draggedIndex, index);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let currentStack = [...stack];
    if (tagInput.trim() && !currentStack.some((t) => t.toLowerCase() === tagInput.trim().toLowerCase())) {
      currentStack = [...currentStack, tagInput.trim()];
      setStack(currentStack);
      setTagInput("");
    }

    if (!title.trim()) {
      toast.error("Please enter a project title.");
      return;
    }

    if (!slug.trim()) {
      toast.error("Please enter a project slug.");
      return;
    }

    if (currentStack.length === 0) {
      toast.error("Please add at least one tech stack item.");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", project?.id ?? "");
        formData.append("title", title.trim());
        formData.append("slug", slug.trim());
        formData.append("summary", summary.trim());
        formData.append("body", body.trim());
        formData.append("stack", currentStack.join(", "));
        formData.append("images", JSON.stringify(images));
        formData.append("socialPosts", JSON.stringify(socialPosts));
        formData.append("sortOrder", String(sortOrder));
        if (sourceUrl.trim()) formData.append("sourceUrl", sourceUrl.trim());
        if (demoUrl.trim()) formData.append("demoUrl", demoUrl.trim());
        if (isPublished) formData.append("isPublished", "on");

        const res = await action(undefined, formData);
        if (res && res.error) {
          const errors = res.error.split(" • ");
          errors.forEach((err) => {
            toast.error(err);
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message || "Failed to save project.");
        }
      }
    });
  };

  return (
    <form
      className="grid gap-6 border-2 border-line bg-surface p-6 shadow-[5px_5px_0_var(--line)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Label>
          Title
          <Input
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Real-Time Distributed Cache"
            required
            value={title}
          />
        </Label>
        <Label>
          Slug
          <Input
            name="slug"
            onChange={(e) => setSlug(e.target.value)}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="e.g. distributed-cache"
            required
            value={slug}
          />
        </Label>
      </div>

      <Label>
        <div className="flex items-center justify-between">
          <span>Summary</span>
          <span className="font-mono text-[10px] text-muted">{summary.length} / 1000 characters</span>
        </div>
        <Textarea
          name="summary"
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief description of the project..."
          required
          rows={3}
          value={summary}
        />
      </Label>

      <div>
        <Label className="mb-2 block">Case study body (Markdown)</Label>
        <MarkdownEditor
          name="body"
          onChange={(val) => setBody(val)}
          required
          rows={12}
          value={body}
        />
      </div>

      {/* --- Tech Stack Input UI --- */}
      <div className="border-2 border-line bg-canvas p-4">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">Tech Stack</span>
        <p className="font-mono text-[11px] text-muted">
          Add technologies used in this project. Press Enter or comma to add.
        </p>

        {/* Active Tech Stack Badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {stack.map((item) => (
            <span
              className="flex items-center gap-1.5 border-2 border-line bg-surface px-2.5 py-1 font-mono text-xs font-bold uppercase text-ink shadow-[2px_2px_0_var(--line)]"
              key={item}
            >
              {item}
              <button
                aria-label={`Remove ${item}`}
                className="text-muted hover:text-danger cursor-pointer"
                onClick={() => handleRemoveTag(item)}
                type="button"
              >
                ✕
              </button>
            </span>
          ))}
          {stack.length === 0 && <p className="font-mono text-xs text-muted">No tech stack added yet.</p>}
        </div>

        {/* Input bar */}
        <div className="mt-3 flex gap-2">
          <Input
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Type technology (e.g. Next.js, Docker) & press Enter"
            value={tagInput}
          />
          <Button onClick={() => handleAddTag(tagInput)} type="button" variant="secondary">
            + Add
          </Button>
        </div>

        {/* Tech Suggestions Chips */}
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase text-muted">Quick suggestions:</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {COMMON_TECH_SUGGESTIONS.map((tech) => {
              const isAdded = stack.some((t) => t.toLowerCase() === tech.toLowerCase());
              return (
                <button
                  className={`border px-2 py-0.5 font-mono text-[10px] uppercase transition-all ${
                    isAdded
                      ? "border-line bg-primary/20 text-muted opacity-50 cursor-not-allowed"
                      : "border-line bg-surface text-ink hover:bg-highlight hover:shadow-[2px_2px_0_var(--line)] cursor-pointer"
                  }`}
                  disabled={isAdded}
                  key={tech}
                  onClick={() => handleAddTag(tech)}
                  type="button"
                >
                  + {tech}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- Social Media Posts Section --- */}
      <div className="border-2 border-line bg-canvas p-4">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">Social Media Posts</span>
        <p className="font-mono text-[11px] text-muted">
          Attach social media posts related to this project (e.g., LinkedIn launch post, X thread, Reddit show & tell).
        </p>

        {/* Active Social Posts Cards */}
        {socialPosts.length > 0 ? (
          <div className="mt-3 space-y-2">
            {socialPosts.map((post, idx) => (
              <div
                className="flex items-center justify-between border-2 border-line bg-surface p-3 shadow-[3px_3px_0_var(--line)]"
                key={`${post.platform}-${idx}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="border-2 border-line bg-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-primary-foreground">
                      {post.platform}
                    </span>
                    <a
                      className="truncate font-mono text-xs text-secondary underline underline-offset-2 hover:text-ink"
                      href={post.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {post.url}
                    </a>
                  </div>
                </div>
                <button
                  className="ml-3 shrink-0 border border-danger bg-canvas px-2 py-1 font-mono text-[10px] uppercase text-danger hover:bg-danger hover:text-canvas cursor-pointer"
                  onClick={() => handleRemoveSocialPost(idx)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 font-mono text-xs text-muted">No social posts attached yet.</p>
        )}

        {/* Add Social Post Form */}
        <div className="mt-4 border-2 border-line bg-surface p-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-[160px_1fr_auto]">
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase text-muted">Platform</label>
              <select
                className="w-full border-2 border-line bg-canvas p-2 font-mono text-xs text-ink focus:outline-none"
                onChange={(e) => setPlatform(e.target.value)}
                value={platform}
              >
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase text-muted">Post URL</label>
              <Input
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://linkedin.com/posts/..."
                type="url"
                value={postUrl}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleAddSocialPost} type="button" variant="secondary">
                + Add Post
              </Button>
            </div>
          </div>

          {platform === "Other" && (
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase text-muted">Custom Platform Name</label>
              <Input
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder="e.g. HackerNews, Hashnode"
                value={customPlatform}
              />
            </div>
          )}
        </div>
      </div>

      {/* --- Image Uploader & Drag-and-Rearrange Section --- */}
      <div className="border-2 border-line bg-canvas p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">Project Images</span>
            <p className="font-mono text-[11px] text-muted">
              Upload images and drag cards to rearrange priority (0 = highest priority).
            </p>
          </div>
          <button
            className="w-fit font-mono text-[11px] uppercase text-secondary underline hover:text-ink cursor-pointer"
            onClick={() => setShowManualInput(!showManualInput)}
            type="button"
          >
            {showManualInput ? "Hide manual URL" : "+ Add by URL"}
          </button>
        </div>

        {/* Upload dropzone */}
        <div
          className="mt-4 flex flex-col items-center justify-center border-2 border-dashed border-line bg-surface p-6 text-center cursor-pointer transition-colors hover:bg-highlight/10"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.length) {
              handleFileUpload(e.dataTransfer.files);
            }
          }}
        >
          <input
            accept="image/*"
            className="hidden"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            ref={fileInputRef}
            type="file"
          />
          <div className="font-mono text-xs uppercase font-bold text-ink">
            {isPending ? "Uploading images to Cloudinary..." : "Click or drag & drop images to upload (multiple supported)"}
          </div>
          <p className="mt-1 font-mono text-[10px] text-muted">Supports PNG, JPG, WEBP • Select one or multiple files</p>
        </div>

        {/* Manual URL input fallback */}
        {showManualInput && (
          <div className="mt-3 grid gap-2 border-2 border-line bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://image-url.com/photo.jpg"
              value={manualUrl}
            />
            <Input
              onChange={(e) => setManualPublicId(e.target.value)}
              placeholder="Public ID (optional)"
              value={manualPublicId}
            />
            <Button onClick={handleAddManualImage} type="button" variant="secondary">
              Add
            </Button>
          </div>
        )}

        {/* Rearrangeable Image Grid */}
        {images.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {images.map((img, idx) => {
              const isDragging = draggedIndex === idx;
              const isOver = dragOverIndex === idx;

              return (
                <div
                  className={`group relative flex flex-col justify-between border-2 border-line bg-surface p-3 transition-all ${
                    isDragging ? "opacity-40 scale-95" : ""
                  } ${isOver ? "border-primary bg-primary/10 shadow-[3px_3px_0_var(--primary)]" : "shadow-[3px_3px_0_var(--line)]"}`}
                  draggable
                  key={`${img.public_id}-${idx}`}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDragStart={() => handleDragStart(idx)}
                  onDrop={() => handleDrop(idx)}
                >
                  {/* Priority Badge */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="border-2 border-line bg-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-primary-foreground">
                      Priority: {img.priority}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-muted">
                      {idx === 0 ? "Hero image" : `#${idx + 1}`}
                    </span>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="relative aspect-video w-full overflow-hidden border-2 border-line bg-canvas">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={`Project thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                      src={img.image_url}
                    />
                  </div>

                  <p className="mt-2 truncate font-mono text-[10px] text-muted" title={img.public_id}>
                    ID: {img.public_id}
                  </p>

                  {/* Controls & Drag Handles */}
                  <div className="mt-3 flex items-center justify-between border-t border-line pt-2">
                    <div className="flex gap-1">
                      <button
                        aria-label="Move left"
                        className="border border-line bg-canvas px-2 py-1 font-mono text-xs disabled:opacity-30 hover:bg-highlight cursor-pointer"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, idx - 1)}
                        title="Move earlier in priority"
                        type="button"
                      >
                        ←
                      </button>
                      <button
                        aria-label="Move right"
                        className="border border-line bg-canvas px-2 py-1 font-mono text-xs disabled:opacity-30 hover:bg-highlight cursor-pointer"
                        disabled={idx === images.length - 1}
                        onClick={() => handleMove(idx, idx + 1)}
                        title="Move later in priority"
                        type="button"
                      >
                        →
                      </button>
                    </div>

                    <span className="cursor-grab font-mono text-[10px] uppercase text-muted group-hover:text-ink">
                      ⠿ Drag
                    </span>

                    <button
                      className="border border-danger bg-canvas px-2 py-1 font-mono text-[10px] uppercase text-danger hover:bg-danger hover:text-canvas cursor-pointer"
                      onClick={() => handleRemoveImage(idx)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 font-mono text-xs text-muted">No images added yet.</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Label>
          Sort order
          <Input
            min="0"
            name="sortOrder"
            onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            type="number"
            value={sortOrder}
          />
        </Label>
        <Label>
          Source URL <span className="font-mono text-[10px] text-muted">(optional)</span>
          <Input
            name="sourceUrl"
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://github.com/... (optional)"
            type="url"
            value={sourceUrl}
          />
        </Label>
        <Label>
          Demo URL <span className="font-mono text-[10px] text-muted">(optional)</span>
          <Input
            name="demoUrl"
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://demo.dev (optional)"
            type="url"
            value={demoUrl}
          />
        </Label>
      </div>

      <Label className="flex items-center gap-2">
        <Input
          checked={isPublished}
          className="mt-0 size-4 cursor-pointer"
          name="isPublished"
          onChange={(e) => setIsPublished(e.target.checked)}
          type="checkbox"
        />
        Published
      </Label>

      <Button className="w-fit" disabled={isPending} type="submit">
        {isPending ? "Saving project..." : label}
      </Button>
    </form>
  );
}
