// "server-only";

"use server";
import { eq, not, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as schema from "@/db/schema";
import { db } from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { uploadFromUrl } from "./file.actions";

// function auth() {
//   return { userId: "sevda677377" }
// }

const { aiImage } = schema;

type AiImageData = {
  url: string;
  prompt: string;
  title: string | null;
  description: string | null;
  model: string | null;
};

export async function saveAiImage(aiImageData: AiImageData) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");


  console.log('old image url', aiImageData.url)
  let imageUrl = await uploadFromUrl(aiImageData.url)
  console.log('new image url', imageUrl)
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
  revalidatePath('/')
  return insertedAiImage;
}

export const getAiImages = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");
  const aiImages = await db.select().from(aiImage)
    .where(eq(aiImage.userId, userId))
    .orderBy(desc(aiImage.createdAt));
  console.log({ aiImages: aiImages.map(ai => ai.url) })
  // revalidatePath('/')
  return aiImages;
};


export const deleteAiImage = async (aiImageId: number) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  await db.delete(aiImage).where(eq(aiImage.id, aiImageId));
  console.log(`DELETE AI IMAGE - "${aiImageId}"}`);
  revalidatePath("/");
};

export async function toggleFavoriteAiImage(aiImageId: number, isFavorite: boolean | null) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  await db.update(aiImage).set({ isFavorite: !isFavorite }).where(eq(aiImage.id, aiImageId));

  revalidatePath("/");
}

// export async function getFavoriteStories() {
//   const user = auth();
//   if (!user.userId) throw new Error("User not authorized");

//   return db.query.story.findMany({
//     where: (model, { eq, and }) => and(eq(model.userId, user.userId), eq(model.isFavorite, true)),
//     orderBy: (model, { desc }) => desc(model.createdAt),
//   });
// }
// "server-only";

// import { auth } from "@clerk/nextjs/server";
// import { db } from "../db/index";
// import { images } from "./schema";
// import { eq } from "drizzle-orm";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";

// export const getImages = (filter = "") => {
//   const user = auth();
//   if (!user.userId) throw new Error("User not authorized");

//   return db.query.images.findMany({
//     where: (model, { eq }) => eq(model.userId, user.userId),
//     orderBy: (model, { desc }) => desc(model.createdAt),
//   });
// };

// export const getImage = async (id: number) => {
//   const user = auth();
//   if (!user.userId) throw new Error("User not authorized");

//   const image = await db.query.images.findFirst({
//     where: (model, { eq }) => eq(model.id, id),
//   });

//   if (!image) {
//     throw new Error("Image not found");
//   }
//   if (image.userId !== user.userId) throw new Error("User not authorized");
//   return image;
// };

// export async function deleteImage(id: number) {
//   const user = auth();
//   if (!user.userId) throw new Error("User not authorized");

//   await db.delete(images).where(eq(images.id, id));
//   redirect("/");
// }

// export async function toggleFavorite(id: number, isFavorite: boolean | null) {
//   const user = auth();
//   if (!user.userId) throw new Error("User not authorized");

//   await db
//     .update(images)
//     .set({ isFavorite: !isFavorite })
//     .where(eq(images.id, id));

//   revalidatePath("/");
// }

// export async function getFavorites() {
//   const user = auth();
//   if (!user.userId) throw new Error("User not authorized");

//   return db.query.images.findMany({
//     where: (model, { eq, and }) =>
//       and(eq(model.userId, user.userId), eq(model.isFavorite, true)),
//     orderBy: (model, { desc }) => desc(model.createdAt),
//   });
// }
