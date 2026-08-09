"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { ProjectImage } from "@/server/projects/types";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: ProjectImage[];
  title?: string;
  className?: string;
}

export function ImageCarousel({ images, title = "Project Image", className }: ImageCarouselProps) {
  // Sort images by priority ascending (or maintain index order)
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }, [images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const total = sortedImages.length;
  const currentImage = sortedImages[currentIndex];

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, isFullscreen]);

  if (!total || !currentImage) return null;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <div className={cn("w-full min-w-[300px] sm:min-w-[600px] space-y-4", className)}>
      {/* Main Slide Container */}
      <div className="relative overflow-hidden border-2 border-line bg-highlight shadow-[6px_6px_0_var(--line)]">
        {/* Header bar / Counter */}
        <div className="flex items-center justify-between border-b-2 border-line bg-canvas px-4 py-2 font-mono text-xs uppercase font-medium">
          <div className="flex items-center gap-2">
            <span className="size-2 bg-primary" />
            <span className="text-ink">
              Image {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Expand image"
              className="flex items-center gap-1 text-muted transition-colors hover:text-ink"
              onClick={() => setIsFullscreen(true)}
              type="button"
            >
              <Maximize2 size={14} />
              <span className="hidden sm:inline">Expand</span>
            </button>
          </div>
        </div>

        {/* Carousel Viewport with Min-Height & Aspect Ratio */}
        <div className="relative aspect-video min-h-[300px] sm:min-h-[420px] w-full overflow-hidden bg-canvas">
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <motion.div
              animate="center"
              className="absolute inset-0 flex items-center justify-center p-2 sm:p-4"
              custom={direction}
              exit="exit"
              initial="enter"
              key={currentIndex}
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              variants={slideVariants}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`${title} slide ${currentIndex + 1}`}
                className="max-h-full max-w-full cursor-zoom-in object-contain"
                onClick={() => setIsFullscreen(true)}
                src={currentImage.image_url}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Overlay Buttons */}
          {total > 1 && (
            <>
              <button
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer border-2 border-line bg-surface p-2 text-ink shadow-[3px_3px_0_var(--line)] transition-all hover:bg-primary hover:text-primary-foreground hover:translate-x-0.5"
                onClick={handlePrev}
                type="button"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-2 border-line bg-surface p-2 text-ink shadow-[3px_3px_0_var(--line)] transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-x-0.5"
                onClick={handleNext}
                type="button"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-2 pt-1">
          {sortedImages.map((_, idx) => (
            <button
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "size-3 border-2 transition-all cursor-pointer",
                idx === currentIndex
                  ? "border-line bg-primary shadow-[2px_2px_0_var(--line)] scale-110"
                  : "border-line bg-surface hover:bg-highlight opacity-70",
              )}
              key={`dot-${idx}`}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              type="button"
            />
          ))}
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            {/* Close button */}
            <button
              aria-label="Close fullscreen view"
              className="absolute right-4 top-4 z-10 cursor-pointer border-2 border-line bg-surface p-2 font-mono text-xs uppercase text-ink shadow-[3px_3px_0_var(--line)] hover:bg-danger hover:text-canvas"
              onClick={() => setIsFullscreen(false)}
              type="button"
            >
              <X size={20} />
            </button>

            {/* Counter */}
            <div className="absolute left-4 top-4 z-10 border-2 border-line bg-surface px-3 py-1.5 font-mono text-xs uppercase text-ink shadow-[3px_3px_0_var(--line)]">
              {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </div>

            {/* Image area */}
            <div className="relative flex h-full w-full items-center justify-center p-12 sm:p-16">
              <AnimatePresence custom={direction} initial={false} mode="popLayout">
                <motion.div
                  animate="center"
                  className="flex max-h-[85vh] max-w-[88vw] items-center justify-center"
                  custom={direction}
                  exit="exit"
                  initial="enter"
                  key={`lightbox-${currentIndex}`}
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  variants={slideVariants}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${title} enlarged view ${currentIndex + 1}`}
                    className="max-h-[85vh] max-w-[88vw] border-2 border-line object-contain shadow-[8px_8px_0_var(--line)]"
                    src={currentImage.image_url}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next arrows */}
              {total > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer border-2 border-line bg-surface p-3 text-ink shadow-[3px_3px_0_var(--line)] transition-all hover:bg-primary hover:text-primary-foreground hover:translate-x-0.5"
                    onClick={handlePrev}
                    type="button"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-2 border-line bg-surface p-3 text-ink shadow-[3px_3px_0_var(--line)] transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-x-0.5"
                    onClick={handleNext}
                    type="button"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Pagination dots */}
            {total > 1 && (
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {sortedImages.map((_, idx) => (
                  <button
                    aria-label={`Go to image ${idx + 1}`}
                    className={cn(
                      "size-3 cursor-pointer border-2 transition-all",
                      idx === currentIndex
                        ? "border-line bg-primary shadow-[2px_2px_0_var(--line)] scale-110"
                        : "border-line bg-surface opacity-70 hover:bg-primary/50",
                    )}
                    key={`lb-dot-${idx}`}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    type="button"
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
