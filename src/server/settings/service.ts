import "server-only";
import { unstable_cache } from "next/cache";
import { connectDatabase } from "@/server/database";
import { SettingsModel } from "@/server/settings/model";

const RESUME_KEY = "resume_url";

const getCachedResumeUrl = unstable_cache(
  async () => {
    await connectDatabase();
    const setting = await SettingsModel.findOne({ key: RESUME_KEY }).lean();
    return setting ? String(setting.value) : null;
  },
  ["resume-url"],
  { tags: ["settings"] },
);

export async function getResumeUrl(): Promise<string | null> {
  try {
    return await getCachedResumeUrl();
  } catch {
    return null;
  }
}

export async function setResumeUrl(url: string): Promise<void> {
  await connectDatabase();
  await SettingsModel.findOneAndUpdate(
    { key: RESUME_KEY },
    { value: url },
    { upsert: true, new: true, runValidators: true },
  );
}
