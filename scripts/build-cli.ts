#!/usr/bin/env bun

// Build script for Britescript CLI
// Creates executable CLI in dist/ folder

import { mkdirSync, writeFileSync, chmodSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { compile } from "../src/index.js";

console.log("🔨 Building Britescript CLI...");

// Step 1: Compile Britescript (.bs) files to TypeScript
console.log("📝 Compiling Britescript files to TypeScript...");

// Create a temporary build directory for compiled TypeScript
const tempBuildDir = "./build-cli-temp";
mkdirSync(tempBuildDir, { recursive: true });
mkdirSync(join(tempBuildDir, "commands"), { recursive: true });

// Find and compile all .bs files in src/cli
const britescriptFiles = [];

function findBsFiles(dir) {
  try {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        findBsFiles(fullPath);
      } else if (item.endsWith(".bs")) {
        britescriptFiles.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
}

findBsFiles("./src/cli");

if (britescriptFiles.length === 0) {
  console.warn("⚠️ No Britescript files found in src/cli directory");
} else {
  console.log(`Found ${britescriptFiles.length} Britescript file(s) to compile`);
  
  // Compile each file
  for (const inputPath of britescriptFiles) {
    const relativePath = relative("./src/cli", inputPath);
    const outputPath = join(tempBuildDir, relativePath.replace(/\.bs$/, ".ts"));
    
    console.log(`Compiling ${inputPath} → ${outputPath}`);
    
    // Ensure output directory exists
    mkdirSync(dirname(outputPath), { recursive: true });
    
    const source = readFileSync(inputPath, "utf8");
    try {
      const compiled = compile(source);
      
      // Handle shebangs
      let finalOutput = compiled;
      if (compiled.includes("#!/usr/bin/env bun")) {
        finalOutput = compiled.replace("#!/usr/bin/env bun\n\n", "");
        finalOutput = "#!/usr/bin/env bun\n\n" + finalOutput;
      }
      
      writeFileSync(outputPath, finalOutput);
    } catch (error) {
      console.error(`Error compiling ${inputPath}:`, error);
      process.exit(1);
    }
  }
  
  // Copy non-BS files
  const tsCopyFiles = ["./src/cli/commands/init.ts", "./src/cli/commands/run.ts", "./src/cli/commands/repl.ts", "./src/cli/commands/help.ts"];
  for (const file of tsCopyFiles) {
    try {
      const relativePath = relative("./src/cli", file);
      const outputPath = join(tempBuildDir, relativePath);
      const content = readFileSync(file, "utf8");
      writeFileSync(outputPath, content);
      console.log(`Copied ${file} → ${outputPath}`);
    } catch (error) {
      console.error(`Error copying ${file}:`, error);
    }
  }
  
  // Update imports in compiled files
  console.log("🔧 Updating import paths...");
  const tsFiles = [];
  findTsFiles(tempBuildDir, tsFiles);
  
  for (const file of tsFiles) {
    const content = readFileSync(file, "utf8");
    const updatedContent = content
      .replace(/from ["']\.\/([^"']+)\.bs["']/g, 'from "./$1"')
      .replace(/from ["']\.\/commands\/([^"']+)\.bs["']/g, 'from "./commands/$1"');
    
    if (content !== updatedContent) {
      writeFileSync(file, updatedContent);
      console.log(`Updated imports in ${file}`);
    }
  }
}

function findTsFiles(dir, result) {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findTsFiles(fullPath, result);
    } else if (item.endsWith(".ts")) {
      result.push(fullPath);
    }
  }
}

// Step 2: Build the CLI with Bun
console.log("\n🔨 Building CLI executable...");

// Create a temporary index.ts file that imports from our compiled files
const tempIndexPath = join(tempBuildDir, "index.ts");
const indexContent = `#!/usr/bin/env bun

// This is a generated file from build-cli.ts
// It imports from the compiled Britescript files

export * from "./index";
`;
writeFileSync(tempIndexPath, indexContent);

// Build the CLI with Bun
const result = await Bun.build({
  entrypoints: [join(tempBuildDir, "index.ts")],
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
const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

const distPackageJson = {
  name: "britescript",
  version: packageJson.version,
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
  license: "MIT",
  repository: packageJson.repository,
  bugs: packageJson.bugs,
  homepage: packageJson.homepage
};

writeFileSync(join("./dist", "package.json"), JSON.stringify(distPackageJson, null, 2));
console.log("📦 Package metadata created: ./dist/package.json");

// Clean up temporary build directory
// Uncomment this when everything is working
// console.log("🧹 Cleaning up temporary files...");
// import { rmSync } from "node:fs";
// rmSync(tempBuildDir, { recursive: true, force: true });

console.log("\n🎉 CLI build complete!");
console.log("You can now run: ./dist/brite --help");

console.log("📦 Package metadata created: ./dist/package.json");