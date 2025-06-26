import { emit } from "./emitter";
import { parse } from "./parser";
import { preprocessCode } from "./preprocessor";
import { transform } from "./transform";

/**
 * Compiles Britescript source code into TypeScript.
 * Supports mixed Britescript and JavaScript/TypeScript syntax.
 *
 * @param source - The .bs source file contents
 * @returns Generated TypeScript code
 */
export function compile(source: string): string {
  const blocks = preprocessCode(source);
  const compiledBlocks: string[] = [];

  for (const block of blocks) {
    if (block.type === "britescript") {
      try {
        const cst = parse(block.content); // Step 1: Parse Britescript
        const ast = transform(cst); // Step 2: Transform to AST
        const ts = emit(ast); // Step 3: Emit TypeScript
        compiledBlocks.push(ts);
      } catch (error) {
        throw new Error(`Britescript compilation error at line ${block.line}: ${error.message}`);
      }
    } else {
      // Pass JavaScript/TypeScript through unchanged
      compiledBlocks.push(block.content.trim());
    }
  }

  return compiledBlocks.join("\n\n");
}
