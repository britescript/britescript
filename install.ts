#!/usr/bin/env bun

// One-command setup for Britescript
// Usage: bun install.ts

import { setupGlobalBritescript } from "./src/runtime";

console.log("🚀 Setting up Britescript...");

// Register global helpers immediately
setupGlobalBritescript();

console.log("✅ Britescript is ready!");
console.log("");
console.log("Now you can:");
console.log("  🔥 Run .bs files: bun --preload ./src/preload.ts your-file.bs");
console.log("  📦 Import .bs files: await importBs('./file.bs')");
console.log("  🏃 Execute .bs files: await runBs('./file.bs')");
console.log("");
console.log("Example .bs file:");
console.log(`
struct User {
  name: string
  age: number
}

let greeting = "Hello World"
greeting |> trim |> console.log
`);

// Test that it works
console.log("🧪 Testing with example file...");
try {
  await (globalThis as any).runBs("./example/index.bs");
  console.log("✅ Test successful!");
} catch (error) {
  console.log("⚠️  Test failed, but setup is complete");
}