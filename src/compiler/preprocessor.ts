// Preprocessor to handle mixed Britescript and JavaScript/TypeScript code

export interface CodeBlock {
  type: "britescript" | "javascript";
  content: string;
  line: number;
}

/**
 * Separates Britescript syntax from JavaScript/TypeScript code
 * Uses a more sophisticated approach to handle multi-line constructs
 */
export function preprocessCode(source: string): CodeBlock[] {
  const lines = source.split("\n");
  const blocks: CodeBlock[] = [];
  let currentBlock: CodeBlock | null = null;
  let braceLevel = 0;
  let inStructDefinition = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const lineNumber = i + 1;

    // Skip comments and empty lines
    if (!trimmedLine || trimmedLine.startsWith("//")) {
      continue;
    }

    // Track brace level for struct definitions
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceLevel += openBraces - closeBraces;

    // Determine if this line starts a Britescript construct
    const startsStruct = trimmedLine.startsWith("struct ");
    const startsTrait = trimmedLine.startsWith("trait ");
    const startsImpl = trimmedLine.startsWith("impl ");
    const startsLet = trimmedLine.startsWith("let ");
    const hasPipe = trimmedLine.includes("|>");

    // Determine block type
    let blockType: "britescript" | "javascript";

    if (startsStruct || startsTrait || startsImpl) {
      blockType = "britescript";
      inStructDefinition = true;
    } else if (inStructDefinition) {
      // Continue struct/impl definition until it closes
      blockType = "britescript";
    } else if (startsLet || hasPipe) {
      blockType = "britescript";
    } else {
      blockType = "javascript";
    }

    // Start new block if type changes or no current block
    if (!currentBlock || currentBlock.type !== blockType) {
      if (currentBlock?.content.trim()) {
        blocks.push(currentBlock);
      }
      currentBlock = {
        type: blockType,
        content: `${line}\n`,
        line: lineNumber,
      };
    } else {
      // Continue current block
      currentBlock.content += `${line}\n`;
    }

    // End struct definition when braces close
    if (inStructDefinition && braceLevel === 0 && closeBraces > 0) {
      inStructDefinition = false;
    }
  }

  // Add final block
  if (currentBlock?.content.trim()) {
    blocks.push(currentBlock);
  }

  return blocks;
}
