// Runtime utility functions for Britescript

/**
 * Pipe utility for chaining operations
 * Usage: pipe(value, fn1, fn2, fn3)
 */
export function pipe<T>(value: T, ...fns: ((v: T) => T)[]): T {
  return fns.reduce((acc, fn) => fn(acc), value);
}

/**
 * Check if a file path is a Britescript file
 */
export function isBritescriptFile(path: string): boolean {
  return path.endsWith(".bs");
}

/**
 * Validate that a path exists and is readable
 */
export async function validateFilePath(path: string): Promise<boolean> {
  try {
    const file = Bun.file(path);
    return await file.exists();
  } catch {
    return false;
  }
}

/**
 * Get file extension from path
 */
export function getFileExtension(path: string): string {
  const lastDot = path.lastIndexOf(".");
  return lastDot === -1 ? "" : path.slice(lastDot);
}