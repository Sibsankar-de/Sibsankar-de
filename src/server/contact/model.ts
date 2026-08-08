import { model, models, Schema } from "mongoose";

const contactQuerySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    deliveryStatus: { type: String, enum: ["sent", "failed"], required: true },
  },
  { timestamps: true },
);

export const ContactQueryModel = models.ContactQuery ?? model("ContactQuery", contactQuerySchema);
