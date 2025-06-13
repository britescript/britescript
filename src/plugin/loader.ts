// File loading and compilation logic

import { compile } from "../compiler";
import type { PluginResult } from "./types";
import { formatCompilationError, isBritescriptFile, parseErrorLocation } from "./utils";

export async function loadBritescriptFile(path: string): Promise<PluginResult> {
  // Validate file type
  if (!isBritescriptFile(path)) {
    return {
      errors: [
        {
          text: `Expected .bs or .bsx file, got: ${path}`,
          location: { file: path, line: 1, column: 0 },
        },
      ],
    };
  }

  try {
    const text = await Bun.file(path).text();
    const contents = compile(text);

    return {
      contents,
      loader: "ts", // Tell Bun to treat the output as TypeScript
    };
  } catch (error) {
    const { line, column } = parseErrorLocation(error as Error);

    return {
      errors: [
        {
          text: formatCompilationError(error as Error, path),
          location: {
            file: path,
            line,
            column,
          },
        },
      ],
    };
  }
}
