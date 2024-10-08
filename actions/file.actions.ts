"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function uploadFromUrl(fileUrl: string) {
  console.log('uploadFromUrl-fileUrl', fileUrl)
  try {
    const uploadedFile = await utapi.uploadFilesFromUrl(fileUrl);
    console.dir(uploadedFile, { depth: 5 })
    console.log('nimic', uploadedFile.data?.url)
    return uploadedFile.data?.url;
  } catch (error) {
    console.error("Failed to upload file from URL", error);
    return null
  }
}