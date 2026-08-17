import { model, models, Schema } from "mongoose";

const imageSchema = new Schema(
  {
    image_url: { type: String, required: true },
    public_id: { type: String, required: true },
    priority: { type: Number, default: 0 },
  },
  { _id: false },
);

const socialPostSchema = new Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    summary: { type: String, required: true, trim: true, maxlength: 1000 },
    body: { type: String, required: true, trim: true, maxlength: 50000 },
    stack: [{ type: String, trim: true }],
    socialPosts: { type: [socialPostSchema], default: [] },
    sourceUrl: { type: String, trim: true },
    demoUrl: { type: String, trim: true },
    images: { type: [imageSchema], default: [] },
    isPublished: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const ProjectModel = models.Project ?? model("Project", projectSchema);
