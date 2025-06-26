// Main Britescript package exports

// Compiler exports
export { compile } from "./compiler/index";
export { preprocessCode } from "./compiler/preprocessor";
export { parse } from "./compiler/parser";
export { transform } from "./compiler/transform";
export { emit } from "./compiler/emitter";

// Plugin exports
export { britescriptPlugin } from "./plugin/index";
export { loadBritescriptFile } from "./plugin/loader";
export { isBritescriptFile } from "./plugin/utils";

// Type exports
export type {
  PluginResult,
  CompilationResult,
  CompilationError,
} from "./plugin/types";

export type { CodeBlock } from "./compiler/preprocessor";
