// "server-only";

"use server";
import { eq, not, desc, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as schema from "@/db/schema";
import { db } from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { uploadFromUrl } from "./file.actions";
import { redirect } from "next/navigation";
import { generateImageDetails } from "./openai";
import { data } from "./data";
import { pp } from "@/app/app.config";
const { AiImages } = schema;

export type newImage = {
  url: string;
  prompt: string;
};

export async function saveAiImage(newImage: newImage) {
  pp(newImage)
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  const imageDetails = await generateImageDetails(newImage.url, newImage.prompt)   
  console.log("imageDetails", imageDetails)

  let result = await uploadFromUrl(newImage.url, imageDetails?.title) 

  if (!result || !result?.data || result.error) 
    throw new Error(result?.error?.message || "Failed to upload image");  


  const insertedAiImage = await db.insert(AiImages)
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

  const aiImages = await db.select().from(AiImages)
    .where(eq(AiImages.userId, userId))
    .orderBy(desc(AiImages.createdAt));

    pp("aiImages", aiImages.slice(0,2))
    pp(aiImages.length)
  return aiImages;
};


export async function getAiImage(id: number) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const [image] = await db.select().from(AiImages).where(eq(AiImages.id, id));

  if (!image) throw new Error("Image not found");

  console.log('img',image.userId, user.userId)
  if (image.userId !== user.userId) throw new Error("Unauthorized");

  return image;
}

export async function deleteAiImage(id: number) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  await db
    .delete(AiImages)
    .where(and(eq(AiImages.id, id), eq(AiImages.userId, user.userId)));

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

  await db.update(AiImages)
    .set({ isFavorite: not(AiImages.isFavorite) })
    .where(eq(AiImages.id, id));

  revalidatePath("/");
}

export async function getAiImageById(id: number) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  const image = await db.query.AiImages.findFirst({
    where: (AiImages, { eq }) => eq(AiImages.id, id),
  });

  if (!image) throw new Error("Image not found");

  // Ensure the user has permission to access this image
  if (image.userId !== userId) throw new Error("User not authorized to access this image");

  return image;
}


export async function updateNullAiImageNames() {
  const { userId } = auth();
  if (!userId) throw new Error("User not authorized");

  const result = await db.update(AiImages)
    .set({ name: "pop_art_image.jpg" })
    .where(eq(AiImages.name, null as unknown as string))
    .returning({ updatedId: AiImages.id });

  console.log(`Updated ${result.length} images with null names`);
  revalidatePath('/');
  return result;
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

export async function addBulkAiImages() {
  const userId = "user_2nTrPtux9tZhQdg2O1SG5R2fnVX";

  for (const item of data) {
    for (const url of item.output) {
      try {
        const imageDetails = await generateImageDetails(url, item.prompt);
        console.log("imageDetails", imageDetails);

        const result = await uploadFromUrl(url, imageDetails?.title);

        if (!result || !result?.data || result.error) {
          console.error("Failed to upload image:", result?.error?.message || "Unknown error");
          continue;
        }

        const insertedAiImage = await db.insert(AiImages)
          .values({   
            url: result.data.url,
            name: result.data.name,
            prompt: item.prompt,
            title: imageDetails.title,
            description: imageDetails.description,
            userId: userId,
            model: "pop-art",
          })
          .returning();

        console.log("Inserted AI Image:", insertedAiImage);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  }

  revalidatePath('/');
  console.log("Bulk image insertion completed");
}
