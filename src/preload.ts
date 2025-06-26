// Preload script for automatic Britescript setup
// This file is loaded by bunfig.toml to enable .bs file support

import { setupGlobalBritescript } from "./runtime";

// Automatically register global Britescript helpers
setupGlobalBritescript();

// Register the plugin for builds (when available)
try {
  // Import the plugin module
  await import("./plugin");

  // Note: Bun's plugin registration via bunfig.toml is experimental
  // For now, plugins need to be explicitly used in build scripts
  console.log("🔧 Britescript plugin available for build scripts");
  console.log("   Use: import { britescriptPlugin } from './plugin'");
  console.log("   Then: Bun.build({ plugins: [britescriptPlugin] })");
} catch (_error) {
  console.log("⚠️  Plugin registration not available in this context");
}

console.log("🚀 Britescript preload complete!");
