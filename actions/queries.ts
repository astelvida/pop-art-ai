"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as schema from "@/db/schema";
import { db } from "@/db/drizzle";
// import { auth } from "@clerk/nextjs/server";
import { uploadFromUrl } from "./file.actions";

function auth() {
  return { userId: "sevda677377" }
}

const { aiImage } = schema;

type AiImageData = {
  url: string;
  title: string;
  prompt: string;
  description: string;
  model: string;
};

export async function saveAiImage(aiImageData: AiImageData) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  // console.log("AI IMAGE DATA", aiImageData)
  // console.log('type of url', typeof aiImageData.url)
  // console.log('old image url', aiImageData.url)
  let imageUrl = await uploadFromUrl(aiImageData.url)
  // console.log('new image url', imageUrl)
  imageUrl = imageUrl || aiImageData.url

  console.log("FINAL IMAGE URL", imageUrl)
  // Insert the story
  const insertedAiImage = await db
    .insert(aiImage)
    .values({
      url: imageUrl,
      userId: userId,
      model: "pop-art",
      prompt: aiImageData.prompt,
    })
    .returning();

  console.log('SUCCESS')
  return insertedAiImage;
}

export const getStories = async () => {
  const stories = await db.query.story.findMany({
    with: {
      chapter: true,
    },
  });
  return stories;
};

// export const getUserStories = async () => {
//   const { userId } = auth();
//   if (!userId) throw new Error("User not authorized");

//   const stories = await db.select().from(story).where(eq(story.userId, userId));
//   return stories;
// };

// export const deleteStory = async (storyId: number) => {
//   await db.delete(story).where(eq(story.id, storyId));
//   console.log(`DELETE STORY - "${storyId}"}`);
//   revalidatePath("/stories");
// };

// export async function toggleFavoriteStory(storyId: number, isFavorite: boolean | null) {
//   const { userId } = auth();
//   if (!userId) throw new Error("User not authorized");

//   await db.update(story).set({ isFavorite: !isFavorite }).where(eq(story.id, storyId));

//   revalidatePath("/");
// }

// export async function getFavoriteStories() {
//   const user = auth();
//   if (!user.userId) throw new Error("User not authorized");

//   return db.query.story.findMany({
//     where: (model, { eq, and }) => and(eq(model.userId, user.userId), eq(model.isFavorite, true)),
//     orderBy: (model, { desc }) => desc(model.createdAt),
//   });
// }
