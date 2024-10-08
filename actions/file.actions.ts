"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function uploadFromUrl(fileUrl: string) {
  try {
    const uploadedFile = await utapi.uploadFilesFromUrl(fileUrl);
    return uploadedFile.data?.url;
  } catch (error) {
    console.error("Failed to upload file from URL", error);
  }
}
