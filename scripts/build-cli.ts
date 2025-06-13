#!/usr/bin/env bun

// Build script for Britescript CLI
// Creates executable CLI in dist/ folder

import { mkdirSync, writeFileSync, chmodSync } from "node:fs";
import { join } from "node:path";

console.log("🔨 Building Britescript CLI...");

// Build the CLI with Bun
const result = await Bun.build({
  entrypoints: ["./src/cli/index.ts"],
  outdir: "./dist",
  target: "bun",
  format: "esm",
  minify: false,
  sourcemap: "external",
  naming: {
    entry: "cli.js"
  }
});

if (!result.success) {
  console.error("❌ Build failed:");
  result.logs.forEach(log => console.error(log));
  process.exit(1);
}

// Ensure dist directory exists
mkdirSync("./dist", { recursive: true });

// Create the executable wrapper
const cliExecutable = `#!/usr/bin/env bun

import "./cli.js";
`;

const executablePath = join("./dist", "brite");
writeFileSync(executablePath, cliExecutable);
chmodSync(executablePath, 0o755);

console.log("✅ CLI built successfully!");
console.log("📁 Output: ./dist/brite");
console.log("🚀 Usage: ./dist/brite --help");

// Also create a package.json for the dist folder
const distPackageJson = {
  name: "britescript",
  version: "0.1.0",
  description: "A language that compiles to TypeScript with traits, structs, and pipes",
  bin: {
    brite: "./brite"
  },
  type: "module",
  engines: {
    bun: ">=1.0.0"
  },
  keywords: [
    "britescript",
    "typescript",
    "compiler",
    "traits",
    "structs",
    "pipes",
    "cli"
  ],
  author: "Britescript Team",
  license: "MIT"
};

writeFileSync(join("./dist", "package.json"), JSON.stringify(distPackageJson, null, 2));

console.log("📦 Package metadata created: ./dist/package.json");