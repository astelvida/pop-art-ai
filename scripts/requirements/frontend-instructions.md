# Project overview
Use this guide to build a web app where users can give a text prompt to generate pop art style images using model hosted on Replicate.

# Feature requirements
- We will use Next.js, Typescript, Shadcn, Lucid, Neon, Drizzle, Clerk
- Create a form where users can put in prompt, and clicking on button that calls the • replicate model to generate pop art images
- Have a nice UI & animation when the image is blank or generating
- Display all the images ever generated in grid
- When hover each generated image img, an icon button for download, an icon button for delete, an icon button for save, and an icon button for like should be shown up

# Relevant docs
Install Replicate’s Node.js client library
npm install replicate

Copy
Set the REPLICATE_API_TOKEN environment variable
export REPLICATE_API_TOKEN=r8_QJH**********************************

Visibility

Copy
This is your Default API token. Keep it to yourself.

Import and set up the client
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

Copy
Run astelvida/pop-art using Replicate’s API. Check out the model's schema for an overview of inputs and outputs.

const output = await replicate.run(
  "astelvida/pop-art:393c9b328cd1ac2f0127db9c7871eef86fded0c369ce2bfb888f9f217c21ca62",
  {
    input: {
      model: "dev",
      lora_scale: 1,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "jpg",
      guidance_scale: 3.5,
      output_quality: 90,
      prompt_strength: 0.8,
      extra_lora_scale: 1,
      num_inference_steps: 28
    }
  }
);
console.log(output);

Copy
To learn more, take a look at the guide on getting started with Node.js.

# Current File structure
.
├── .next
├── actions
│   ├── ai-services.ts
│   ├── file.actions.ts
│   ├── openai.ts
│   └── queries.ts
├── app
│   ├── api
│   │   └── uploadthing
│   │       ├── core.ts
│   │       └── route.ts
│   ├── fonts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── slider.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
│   ├── EmptyState.tsx
│   ├── ImageActions.tsx
│   ├── SearchBar.tsx
│   ├── SkeletonLoader.tsx
│   ├── app-sidebar.tsx
│   ├── image-generator.tsx
│   ├── mode-toggle.tsx
│   └── theme-provider.tsx
├── db
│   └── migrations
├── lib
│   └── hooks
│       ├── use-mobile.tsx
│       └── use-sidebar.tsx
│   └── utils.ts
├── node_modules
├── .env.local
├── .eslintrc.json
├── .gitignore
├── README.md
├── components.json
├── drizzle.config.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json

