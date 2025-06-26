#!/usr/bin/env bun

// Compile script for Britescript
// Compiles Britescript files to executable binaries

import { parseArgs } from "node:util";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { compile } from "../src/index.js";

console.log("🔨 Britescript Compiler");

// Parse command line arguments
const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    help: { type: "boolean", short: "h" },
    output: { type: "string", short: "o" },
    target: { type: "string", short: "t", default: "bun" },
    minify: { type: "boolean", short: "m", default: false },
  },
  allowPositionals: true,
});

// Show help
if (values.help || positionals.length === 0) {
  console.log("Usage: bun compile.ts [options] <file.bs>");
  console.log("");
  console.log("Options:");
  console.log("  -h, --help            Show this help message");
  console.log("  -o, --output <file>   Output file (default: <input>.exe)");
  console.log("  -t, --target <target> Target platform (default: bun)");
  console.log("  -m, --minify          Minify output");
  console.log("");
  console.log("Examples:");
  console.log("  bun compile.ts app.bs");
  console.log("  bun compile.ts -o myapp app.bs");
  console.log("  bun compile.ts -t node -m app.bs");
  process.exit(values.help ? 0 : 1);
}

// Get input file
const inputFile = positionals[0];
if (!existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

// Determine output file
const outputFile = values.output || `${basename(inputFile, ".bs")}.exe`;

console.log(`📝 Compiling ${inputFile} to ${outputFile}`);

// Read input file
const source = readFileSync(inputFile, "utf8");

// Compile Britescript to TypeScript
console.log("🔄 Transpiling Britescript to TypeScript...");
let tsCode;
try {
  tsCode = compile(source);
} catch (error) {
  console.error("❌ Compilation error:", error);
  process.exit(1);
}

// Create a temporary TypeScript file
const tempTsFile = join(dirname(inputFile), `.${basename(inputFile)}.temp.ts`);
writeFileSync(tempTsFile, tsCode);

// Compile to executable using Bun
console.log("🔧 Building executable...");
const buildResult = await Bun.build({
  entrypoints: [tempTsFile],
  outfile: outputFile,
  target: values.target,
  minify: values.minify,
});

// Clean up temporary file
Bun.spawn(["rm", tempTsFile]);

if (!buildResult.success) {
  console.error("❌ Build failed:");
  buildResult.logs.forEach(log => console.error(log));
  process.exit(1);
}

// Make the output file executable
Bun.spawn(["chmod", "+x", outputFile]);

console.log(`✅ Compiled successfully to ${outputFile}`);
console.log(`🚀 Run with: ./${outputFile}`);