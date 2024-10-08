"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const StorySchema = z.object({
  title: z.string(),
  chapters: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
});

export async function generateStory(formData: FormData) {
  const prompt = formData.get("prompt");

  console.log("Generating story with prompt:", prompt);

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    response_format: zodResponseFormat(StorySchema, "story"),
    messages: [
      {
        role: "system",
        content:
          "You are a creative story writer. Generate a short story based on the given prompt. The story has a title and three chapters, each with a title and content. Each chapter has maximum 200 characters.",
      },
      {
        role: "user",
        content: `Generate a short story about: ${prompt || "A cyberpunk fever dream"} `,
      },
    ],
    max_tokens: 1000,
  });

  const parsedCompletion = completion.choices[0].message.parsed;
  return parsedCompletion
}

export async function generateImage(
  prompt: string,
  isBuffer: boolean | undefined = false
): Promise<string> {
  try {
    const response_format = isBuffer ? "b64_json" : "url";
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "512x512",
      response_format,
    });

    console.log("Image response:", response);
    const imageUrl = response.data[0][response_format];

    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
}

export const generateImageWithData = async (prompt, chapter, index) => {
  const url = await generateImage(prompt);

  console.log("Generated image for chapter:", { url, prompt });

  return { ...chapter, image: url, index };
};

export async function generateImagesForChapters({ title, chapters }): Promise<string[]> {
  const imagePromises = chapters.map((chapter, index) =>
    generateImageWithData(
      `Create an image for the #${index + 1} chapter titled "${chapter.title
      }". The chapter is about: ${chapter.content}`,
      chapter,
      index
    )
  );

  try {
    const data = await Promise.all(imagePromises);
    console.dir(data, { null: 4 });
    return data;
  } catch (error) {
    console.error("Error generating images for chapters:", error);
    throw new Error("Failed to generate images for chapters");
  }
}

// export async function generateStreamingStory(formData: FormData) {
//   const prompt = formData.get("prompt");

//   console.log("Generating streaming story with prompt:", prompt);

//   const stream = openai.beta.chat.completions
//     .stream({
//       model: "gpt-4o-2024-08-06",
//       messages: [
//         {
//           role: "system",
//           content:
//             'You are a creative story writer. Generate a short story based on the given prompt. The story should have a title and three chapters, each with a title and content. Each chapter should have a maximum of 200 characters. Format your response as JSON with the following structure: { "title": "Story Title", "chapters": [{ "title": "Chapter 1 Title", "content": "Chapter 1 content" }, { "title": "Chapter 2 Title", "content": "Chapter 2 content" }, { "title": "Chapter 3 Title", "content": "Chapter 3 content" }] }',
//         },
//         {
//           role: "user",
//           content: `Generate a short story about: ${prompt || "A cyberpunk fever dream"} `,
//         },
//       ],
//       max_tokens: 1000,
//       stream: true,
//     })
//     .on("refusal.delta", ({ delta }) => {
//       process.stdout.write(delta);
//     })
//     .on("content.delta", ({ snapshot, parsed }) => {
//       console.log("content:", snapshot);
//       console.log("parsed:", parsed);
//       return new Response(snapshot);
//     })
//     .on("content.done", (props) => {
//       if (props.parsed) {
//         console.log("\n\nfinished parsing!");
//         console.log(`answer: ${props.parsed.final_answer}`);
//       }
//     });

//   // return stream;
//   // return stream;
//   await stream.done();

//   const completion = await stream.finalChatCompletion();

//   console.dir(completion, { depth: 5 });

//   return completion;

//   // const message = completion.choices[0]?.message;
//   // if (message?.parsed) {
//   //   console.log(message.parsed.steps);
//   // }
// }
