// Runtime compilation utilities

import { mkdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { compile } from "../compiler";

/**
 * Compile a Britescript file to a temporary TypeScript file
 */
export async function compileToTemp(bsPath: string): Promise<string> {
  // Read and compile the .bs file
  const file = Bun.file(bsPath);
  const source = await file.text();
  const compiled = compile(source);

  // Create temporary file
  const tempDir = "/tmp/britescript";
  mkdirSync(tempDir, { recursive: true });

  const baseName = basename(bsPath).replace(/\.(bs|bsx)$/, "");
  const tempPath = join(tempDir, `${baseName}-${Date.now()}.ts`);

  writeFileSync(tempPath, compiled);
  return tempPath;
}

/**
 * Clean up temporary file (best effort)
 */
export async function cleanupTemp(tempPath: string): Promise<void> {
  try {
    await Bun.file(tempPath).remove?.();
  } catch {
    // Ignore cleanup errors - OS will clean /tmp
  }
}