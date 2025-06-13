// Plugin type definitions

export interface CompilationResult {
  contents: string;
  loader: "ts" | "js";
}

export interface CompilationError {
  errors: Array<{
    text: string;
    location: {
      file: string;
      line: number;
      column: number;
    };
  }>;
}

export type PluginResult = CompilationResult | CompilationError;
