import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AiImageDetails = z.object({
  title: z.string(),
  caption: z.string(),
  description: z.string(),
});

export async function generateImageDetails(imageUrl: string, prompt: string) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Given this image, and this prompt: "${prompt}", extract the title, caption, and description.`,
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
    response_format: zodResponseFormat(AiImageDetails, "ai_image_details"),
  });

  const result = completion.choices[0].message.parsed;
  console.log(result);
  return result;
}

// export async function generateImageDetails(imageUrl: string, prompt: string) {
//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "user",
//         content: [
//           { type: "text", text: "What’s in this image? Give me a title, caption, and description." },
//           {
//             type: "image_url",
//             image_url: {
//               url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
//             },
//           },
//         ],
//       },
//     ],
//   });
//   console.log(response.choices[0]);

//   return response.choices[0].message.content;
// }
// generateImageDetailsStructuredOutput('https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg', 'An image of a nature boardwalk with a clear sky and grass')