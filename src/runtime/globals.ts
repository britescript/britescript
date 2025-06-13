// Global runtime setup for Britescript

import { importBritescript, runBritescript } from "./loader";

/**
 * Register global functions to make importing .bs files easier
 * This enables: importBs('./file.bs') and runBs('./file.bs') anywhere
 */
export function setupGlobalBritescript(): void {
  (globalThis as any).importBs = importBritescript;
  (globalThis as any).runBs = runBritescript;

  console.log("🚀 Britescript runtime helpers registered:");
  console.log("  - importBs('./path/to/file.bs') - Import a .bs file");
  console.log("  - runBs('./path/to/file.bs') - Execute a .bs file");
}

/**
 * Check if global Britescript helpers are already registered
 */
export function isGlobalBritescriptSetup(): boolean {
  return typeof (globalThis as any).importBs === "function" &&
         typeof (globalThis as any).runBs === "function";
}