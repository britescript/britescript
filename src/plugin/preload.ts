// Preload script to register Britescript plugin globally
// This enables direct imports of .bs files in TypeScript

import { plugin } from "bun";
import { britescriptPlugin } from "./index";

// Register the Britescript plugin globally
plugin(britescriptPlugin);

console.log("🚀 Britescript plugin loaded globally - you can now import .bs files!");
