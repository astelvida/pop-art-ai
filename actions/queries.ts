// "server-only";

"use server";
import { eq, not, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as schema from "@/db/schema";
import { db } from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { uploadFromUrl } from "./file.actions";
import { redirect } from "next/navigation";
import { generateImageDetails } from "./openai";

const { aiImage } = schema;

export type newImage = {
  url: string;
  prompt: string;
};

export async function saveAiImage(newImage: newImage) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  const imageDetails = await generateImageDetails(newImage.url, newImage.prompt)   
  console.log("imageDetails", imageDetails)

  let result = await uploadFromUrl(newImage.url, imageDetails?.title) 

  if (!result || !result?.data || result.error) 
    throw new Error(result?.error?.message || "Failed to upload image");  


  const insertedAiImage = await db.insert(aiImage)
    .values({   
      url: result.data.url,
      name: result.data.name,
      prompt: newImage.prompt,
      title: imageDetails.title,
      description: imageDetails.description,
      userId: userId,
      model: "pop-art",
    })
    .returning();

    console.log(insertedAiImage)
  revalidatePath('/')
  return insertedAiImage;
}

export const getAiImages = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  const aiImages = await db.select().from(aiImage)
    .where(eq(aiImage.userId, userId))
    .orderBy(desc(aiImage.createdAt));

  return aiImages;
};


export async function getAiImage(id: number) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const [image] = await db.select().from(aiImage).where(eq(aiImage.id, id));

  console.log(image)
  if (!image) throw new Error("Image not found");

  console.log('img',image.userId, user.userId)
  if (image.userId !== user.userId) throw new Error("Unauthorized");

  return image;
}

export async function deleteAiImage(id: number) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  await db
    .delete(aiImage)
    .where(and(eq(aiImage.id, id), eq(aiImage.userId, user.userId)));

  // analyticsServerClient.capture({
  //   distinctId: user.userId,
  //   event: "delete image",
  //   properties: {
  //     imageId: id,
  //   },
  // });

  redirect("/");
}


export async function toggleFavoriteAiImage(id: number) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  await db.update(aiImage)
    .set({ isFavorite: not(aiImage.isFavorite) })
    .where(eq(aiImage.id, id));

  revalidatePath("/");
}

export async function getAiImageById(id: number) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  const image = await db.query.aiImage.findFirst({
    where: (aiImage, { eq }) => eq(aiImage.id, id),
  });

  if (!image) throw new Error("Image not found");

  // Ensure the user has permission to access this image
  if (image.userId !== userId) throw new Error("User not authorized to access this image");

  return image;
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
