#!/usr/bin/env bun

// Release build script for Britescript
// Creates a complete distributable package

import { mkdirSync, writeFileSync, chmodSync, copyFileSync, rmSync } from "node:fs";
import { join } from "node:path";

console.log("🚀 Building Britescript for release...");

// Clean existing dist
try {
  rmSync("./dist", { recursive: true, force: true });
} catch {
  // Ignore if doesn't exist
}

// Build the CLI using our build-cli.ts script
console.log("🔨 Building CLI...");
const cliProcess = Bun.spawn(["bun", "scripts/build-cli.ts"], {
  stdout: "inherit",
  stderr: "inherit"
});

const cliExitCode = await cliProcess.exited;
if (cliExitCode !== 0) {
  console.error(`❌ CLI build failed with exit code ${cliExitCode}`);
  process.exit(1);
}

// Build the library/compiler
console.log("📚 Building library...");
const libResult = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "bun",
  format: "esm",
  minify: true,
  sourcemap: "external",
  naming: {
    entry: "index.js"
  }
});

if (!libResult.success) {
  console.error("❌ Library build failed:");
  libResult.logs.forEach(log => console.error(log));
  process.exit(1);
}

// Ensure dist directory exists
mkdirSync("./dist", { recursive: true });

// Create the CLI executable
const cliExecutable = `#!/usr/bin/env bun

import "./cli.js";
`;

const executablePath = join("./dist", "brite");
writeFileSync(executablePath, cliExecutable);
chmodSync(executablePath, 0o755);

// Read version from package.json
const packageJson = await Bun.file("./package.json").json();
const version = packageJson.version;

// Create release package.json
const releasePackageJson = {
  name: "britescript",
  version: version,
  description: "A language that compiles to TypeScript with traits, structs, and pipes",
  main: "./index.js",
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
    "cli",
    "language",
    "functional-programming"
  ],
  author: "Britescript Team",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/britescript/britescript.git"
  },
  homepage: "https://britescript.dev",
  bugs: {
    url: "https://github.com/britescript/britescript/issues"
  },
  files: [
    "*.js",
    "*.js.map",
    "brite",
    "README.md",
    "LICENSE"
  ]
};

writeFileSync(join("./dist", "package.json"), JSON.stringify(releasePackageJson, null, 2));

// Copy important files
try {
  copyFileSync("./README.md", "./dist/README.md");
  console.log("📄 Copied README.md");
} catch {
  console.log("⚠️  README.md not found, skipping");
}

try {
  copyFileSync("./LICENSE", "./dist/LICENSE");
  console.log("📄 Copied LICENSE");
} catch {
  console.log("⚠️  LICENSE not found, skipping");
}

// Create installation instructions
const installInstructions = `# Britescript Installation

## Global Installation
\`\`\`bash
bun install -g britescript
\`\`\`

## Local Installation
\`\`\`bash
bun add -d britescript
\`\`\`

## Usage
\`\`\`bash
# Create new project
brite init my-project

# Run Britescript files
brite run main.bs

# Compile to TypeScript
brite compile main.bs

# Interactive REPL
brite repl
\`\`\`

## Documentation
- [Getting Started](https://britescript.dev/docs)
- [Language Reference](https://britescript.dev/reference)
- [Examples](https://github.com/britescript/britescript/tree/main/examples)
`;

writeFileSync(join("./dist", "INSTALL.md"), installInstructions);

// Build summary
const stats = {
  version,
  files: [
    "brite (executable)",
    "cli.js (CLI implementation)",
    "index.js (library)",
    "package.json (package metadata)",
    "*.js.map (source maps)"
  ],
  size: "~500KB (minified)"
};

console.log("\n✅ Release build complete!");
console.log("📁 Output directory: ./dist/");
console.log(`📦 Version: ${stats.version}`);
console.log("📋 Files created:");
stats.files.forEach(file => console.log(`   - ${file}`));

console.log("\n🚀 Ready for distribution!");
console.log("💡 Next steps:");
console.log("   1. Test: ./dist/brite --help");
console.log("   2. Package: cd dist && npm pack");
console.log("   3. Publish: npm publish");

// Create a quick test script
const testScript = `#!/usr/bin/env bun

// Quick test script for release build
console.log("🧪 Testing release build...");

import { spawn } from "node:child_process";

const tests = [
  ["--version"],
  ["--help"], 
  ["help", "init"]
];

for (const test of tests) {
  console.log(\`Testing: brite \${test.join(" ")}\`);
  const result = await new Promise((resolve) => {
    const child = spawn("./brite", test, { cwd: "./dist" });
    child.on("exit", resolve);
  });
  console.log(\`Exit code: \${result}\`);
}

console.log("✅ Release build tests complete!");
`;

writeFileSync(join("./dist", "test-release.ts"), testScript);
chmodSync(join("./dist", "test-release.ts"), 0o755);

console.log("🧪 Test script created: ./dist/test-release.ts");