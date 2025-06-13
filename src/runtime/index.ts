// Main runtime exports for Britescript

// Re-export all runtime functionality
export { compileToTemp, cleanupTemp } from "./compiler";
export { importBritescript, runBritescript } from "./loader";
export { setupGlobalBritescript, isGlobalBritescriptSetup } from "./globals";
export { pipe, isBritescriptFile, validateFilePath, getFileExtension } from "./utils";

// Convenience re-exports with shorter names
export { importBritescript as importBs, runBritescript as runBs } from "./loader";
