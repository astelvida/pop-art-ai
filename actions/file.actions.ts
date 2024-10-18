"use server";

import { pp } from "@/lib/pprint";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

type MaybeURL = string | URL;
type URLWithOverrides = { url: MaybeURL; name?: string; customId?: string };

function extractFileNameFromUrl(url: URL): string {
  try {
    const pathSegments = url.pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  } catch (error) {
    console.error("Failed to parse URL", error);
    return "";
  }
}

function slugify(text) {
  return text
    .toString() // Convert to string
    .normalize("NFD") // Normalize Unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase() // Convert to lowercase
    .trim() // Trim leading and trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

// Example usage

export async function uploadFromUrl(url: MaybeURL, name: string) {
  try {
    const replicateUrl = new URL(url);
    const fileName = extractFileNameFromUrl(replicateUrl);
    const newName = `${slugify(name)}.${fileName.split(".")[1]}`
    pp({replicateUrl, fileName, newName})
    const uploadedFile = await utapi.uploadFilesFromUrl(<URLWithOverrides>{
      url: replicateUrl,
      name: newName,
      // customId: "123"
    });
    pp(uploadedFile);
    return uploadedFile;
  } catch (error) {
    console.error("Failed to upload file from URL", error);
    return null;
  }
}

// {
//   data: {
//     key: 'DJ9iVbfnTNKnvApSoVrfO2BTcn3GY0kJ8CzgFIljpbPyuXEA',
//     url: 'https://utfs.io/f/DJ9iVbfnTNKnvApSoVrfO2BTcn3GY0kJ8CzgFIljpbPyuXEA',
//     appUrl: 'https://utfs.io/a/vrclg02ztd/DJ9iVbfnTNKnvApSoVrfO2BTcn3GY0kJ8CzgFIljpbPyuXEA',
//     lastModified: 1729118324284,
//     name: 'pop_art_image_out-0.jpg',
//     size: 62222,
//     type: 'image/jpeg',
//     customId: null
//   },
//   error: null
// }

// const urls: string[] = [];

// data.forEach(async (item) => {
//   const uploadedFile1 = await uploadFromUrl(item.output[0], item.prompt);
//   const uploadedFile2 = await uploadFromUrl(item.output[1], item.prompt);
//   console.log(item.prompt);
//   console.log(uploadedFile1?.data?.url, uploadedFile2?.data?.url);
//   console.log("-----------------------------------");
//   if (uploadedFile1?.data?.url && uploadedFile2?.data?.url) {
//     urls.push(uploadedFile1?.data?.url, uploadedFile2?.data?.url);
//   }
// });

// console.log(JSON.stringify(urls, null, 2));
