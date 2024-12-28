// import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";
// import eslintConfigPrettier from "eslint-config-prettier";
// import nextPlugin from "@next/eslint-plugin-next";

// export default [
//   {
//     files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
//     languageOptions: {
//       globals: {...globals.browser, ...globals.node},
//       parserOptions: {
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//         ecmaFeatures: {
//           jsx: true,
//         },
//       },
//     },
//   },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   pluginReact.configs.recommended,
//   nextPlugin.configs['core-web-vitals'],
//   nextPlugin.configs.typescript,  // Add this line to include next/typescript
//   eslintConfigPrettier,
// ];

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [...compat.extends('next/core-web-vitals', 'next/typescript')]

export default eslintConfig
