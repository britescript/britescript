// Build configuration with Britescript plugin
// Usage: bun build --config ./build.config.ts

import { britescriptPlugin } from "./src/plugin";

export default {
  entrypoints: [
    "./src/index.ts",
    "./src/cli/index.ts"
  ],
  outdir: "./dist",
  plugins: [britescriptPlugin],
  target: "bun",
  format: "esm",
  minify: false,
  sourcemap: "external",
  splitting: false,
  naming: {
    entry: "[name].js",
    chunk: "[name]-[hash].js",
    asset: "[name]-[hash].[ext]"
  }
} satisfies Parameters<typeof Bun.build>[0];