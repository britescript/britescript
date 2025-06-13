// Dynamic loading utilities for Britescript files

import { compileToTemp, cleanupTemp } from "./compiler";

/**
 * Dynamically import a .bs file by compiling it to a temporary .ts file
 * This works at runtime and provides a clean import experience
 */
export async function importBritescript(bsPath: string): Promise<any> {
  const tempPath = await compileToTemp(bsPath);

  try {
    // Import the compiled file
    return await import(tempPath);
  } finally {
    // Clean up temporary file
    await cleanupTemp(tempPath);
  }
}

/**
 * Execute a .bs file directly (like running a script)
 */
export async function runBritescript(bsPath: string): Promise<any> {
  // Use the same approach as importBritescript
  const module = await importBritescript(bsPath);
  return module;
}