"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

type MaybeURL = string | URL;
type URLWithOverrides = { url: MaybeURL; name?: string; customId?: string };

function extractFileNameFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/");
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

export async function uploadFromUrl(url: string, name: string) {
  try {
    const fileName = extractFileNameFromUrl(url);
    const uploadedFile = await utapi.uploadFilesFromUrl(<URLWithOverrides>{
      url: url,
      name: `${slugify(name)}.${fileName.split(".")[1]}`,
    });
    console.dir(uploadedFile, { depth: 5 });
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
