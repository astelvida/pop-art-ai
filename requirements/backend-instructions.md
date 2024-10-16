# Project overview
Use this guide to build a web app where users can give a text prompt to generate pop art style aiImages using model hosted on Replicate.

# Database
- Create a table called "profiles"
- Create a table called "aiImages"

## profiles table
  userld
  tier
  credits
  stripe_customer_id
  stripe_subscription_id

## aiImages table
  id
  img_url
  prompt
  num_likes
  creator_userld

## favorites table
  id
  aiImage_id
  user_id

# Feature requirements
1. Create user to user table
  1. After a user signin via clerk, we should get the userId from clerk, and check if this userId exist in 'profiles' table, matching "user_id"
  2. if the user doesnt exist, then create a user in 'profiles' table
  3. if the user exist already, then proceed, and pass on user_id to functions like generate ai_aiImages
2. Upload ai_image to "aiImages" supabase storage bucket;
  1. When user generating an ai_image, upload the ai_image image file returned from Replicate to supabase "aiImages" storage bucket
  2. Add the image url to te "aiImages" data table as "image_url", and creator_user_id to be the actual user_id
3. Display all aiImages in ai_imagegrid
  1. ai_image grid should fetch and display all aiImages from "aiImages" data table
  2. when a new ai_image is generated, the ai_imagegrid should be updated automatically to add the new ai_image to the grid
4. Likes interaction
  1. When user check on 'like' button, the num_likes should increase on the 'aiImages' table
  2. when user un-check 'like' button, the num_likes should decrease on the 'aiImages' table




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

