/* eslint-disable import/no-extraneous-dependencies */
import path from "node:path";
import { fileURLToPath } from "node:url";
// @ts-ignore
import { FlatCompat } from "@eslint/eslintrc";
// @ts-ignore
import pluginJs from "@eslint/js";

// mimic CommonJS variables -- not needed if using CommonJS
// @ts-ignore
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
  resolvePluginsRelativeTo: dirname,
  recommendedConfig: pluginJs.configs.recommended,
  allConfig: pluginJs.configs.all,
});

export default {
  languageOptions: {
    globals: {
      es2021: true,
      node: true,
    },
  },
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["node_modules/", "dist/", ".git/", ".vscode/"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unsafe-declaration-merging": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-use-before-define": "error",
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": [
      "error",
      { allow: ["arrowFunctions"] },
    ],
    "class-methods-use-this": "off",
    "default-case": "off",
    "default-param-last": "off",
    "import/prefer-default-export": "off",
    "import/extensions": "off",
    radix: "off",
    "import/no-unresolved": "off",
    "no-async-promise-executor": "off",
    "lines-between-class-members": [
      "error",
      "always",
      {
        exceptAfterSingleLine: true,
      },
    ],
    "no-param-reassign": [
      "error",
      {
        props: false,
      },
    ],
    "no-bitwise": "off",
    "no-eval": "off",
    "no-restricted-syntax": "off",
    "no-restricted-globals": "off",
    "no-continue": "off",
    "no-console": "off",
    "no-use-before-define": "off",
    "no-shadow": "off",
    "no-await-in-loop": "off",
    "no-plusplus": [
      "error",
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    "require-await": "error",
    "prettier/prettier": [
      "error",
      {
        "no-await-in-loop": "off",
      },
      {
        usePrettierrc: true,
      },
    ],
  },
  ...compat,
};
