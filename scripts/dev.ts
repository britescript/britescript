#!/usr/bin/env bun

// Development script for Britescript
// Provides easy access to CLI during development

import { spawn } from "node:child_process";

const args = Bun.argv.slice(2);

console.log("🔧 Running Britescript CLI in development mode");
console.log(`📝 Command: brite ${args.join(" ")}`);
console.log("─".repeat(50));

// Run the CLI directly from source
const child = spawn("bun", ["src/cli/index.ts", ...args], {
  stdio: "inherit",
  cwd: process.cwd()
});

child.on("exit", (code) => {
  process.exit(code || 0);
});