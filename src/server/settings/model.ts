import { model, models, Schema } from "mongoose";

const settingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: String, required: true },
  },
  { timestamps: true },
);

export const SettingsModel = models.Settings ?? model("Settings", settingsSchema);
