// Plugin utility functions

/**
 * Check if a file path is a Britescript file
 */
export function isBritescriptFile(path: string): boolean {
  return path.endsWith(".bs") || path.endsWith(".bsx");
}

/**
 * Generate a descriptive error message for compilation failures
 */
export function formatCompilationError(error: Error, filePath: string): string {
  const message = error.message || "Unknown compilation error";
  return `Failed to compile ${filePath}: ${message}`;
}

/**
 * Extract line and column information from error if available
 */
export function parseErrorLocation(error: Error): { line: number; column: number } {
  // Default location if parsing fails
  let line = 1;
  let column = 0;

  // Try to extract location from error message
  const locationMatch = error.message.match(/line (\d+), column (\d+)/);
  if (locationMatch) {
    line = Number.parseInt(locationMatch[1], 10);
    column = Number.parseInt(locationMatch[2], 10);
  }

  return { line, column };
}
