"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as schema from "@/db/schema";
import { db } from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { uploadFromUrl } from "./file.actions";

const { story, chapter } = schema;

export async function createStory(storyData) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  // Insert the story
  const [insertedStory] = await db
    .insert(story)
    .values({
      title: storyData.title,
      userId,
    })
    .returning();

  // Process the chapters
  const chapterInserts = storyData.chapters.map(async (chapter, index) => {
    const imageUrl = chapter.image ? await uploadFromUrl(chapter.image) : await Promise.resolve("");
    return {
      storyId: insertedStory.id,
      num: index + 1,
      title: chapter.title,
      content: chapter.content,
      imageUrl: imageUrl || "",
    };
  });

  const insertedChaptersResolved = await Promise.all(chapterInserts);
  await db.insert(chapter).values(insertedChaptersResolved);

  console.log(`CREATE STORY - "${storyData.title}" for user ${userId}`);
  return insertedStory;
}

export const getStories = async () => {
  const stories = await db.query.story.findMany({
    with: {
      chapter: true,
    },
  });
  return stories;
};

export const getUserStories = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  const stories = await db.select().from(story).where(eq(story.userId, userId));
  return stories;
};

export const deleteStory = async (storyId: number) => {
  await db.delete(story).where(eq(story.id, storyId));
  console.log(`DELETE STORY - "${storyId}"}`);
  revalidatePath("/stories");
};

export async function toggleFavoriteStory(storyId: number, isFavorite: boolean | null) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  await db.update(story).set({ isFavorite: !isFavorite }).where(eq(story.id, storyId));

  revalidatePath("/");
}

export async function getFavoriteStories() {
  const user = auth();
  if (!user.userId) throw new Error("User not authorized");

  return db.query.story.findMany({
    where: (model, { eq, and }) => and(eq(model.userId, user.userId), eq(model.isFavorite, true)),
    orderBy: (model, { desc }) => desc(model.createdAt),
  });
}

// deleteStories();

// export const deleteTodo = async (id: number) => {
//   await db.delete(todo).where(eq(todo.id, id));

//   revalidatePath("/");
// };

// export const toggleTodo = async (id: number) => {
//   await db
//     .update(todo)
//     .set({
//       done: not(todo.done),
//     })
//     .where(eq(todo.id, id));

//   revalidatePath("/");
// };

// export const editTodo = async (id: number, text: string) => {
//   await db
//     .update(todo)
//     .set({
//       text: text,
//     })
//     .where(eq(todo.id, id));

//   revalidatePath("/");
// };
