// Main Bun plugin for Britescript

import type { BunPlugin } from "bun";
import { FILE_FILTER, PLUGIN_NAME } from "./config";
import { loadBritescriptFile } from "./loader";

export const britescriptPlugin: BunPlugin = {
  name: PLUGIN_NAME,
  setup(build) {
    build.onLoad({ filter: FILE_FILTER }, async (args) => {
      return await loadBritescriptFile(args.path);
    });
  },
};

// Re-export types and utilities for external use
export type { PluginResult, CompilationResult, CompilationError } from "./types";
export { PLUGIN_NAME, FILE_FILTER, DEFAULT_CONFIG } from "./config";
export { loadBritescriptFile } from "./loader";
export { isBritescriptFile, formatCompilationError } from "./utils";
