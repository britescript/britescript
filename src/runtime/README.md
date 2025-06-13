# Britescript Runtime

The runtime module provides dynamic loading and execution of Britescript files. It's organized into focused, modular files for better maintainability.

## Module Structure

### `index.ts` - Main Exports
Central exports for all runtime functionality with convenience aliases.

### `compiler.ts` - Compilation Utilities
- `compileToTemp(bsPath)` - Compile .bs file to temporary .ts file
- `cleanupTemp(tempPath)` - Clean up temporary files

### `loader.ts` - Dynamic Loading
- `importBritescript(bsPath)` - Import a .bs file as a module
- `runBritescript(bsPath)` - Execute a .bs file directly

### `globals.ts` - Global Runtime Setup
- `setupGlobalBritescript()` - Register global `importBs()` and `runBs()` helpers
- `isGlobalBritescriptSetup()` - Check if globals are registered

### `utils.ts` - Utility Functions
- `pipe(value, ...fns)` - Functional pipe utility
- `isBritescriptFile(path)` - Check if file is a .bs file
- `validateFilePath(path)` - Validate file exists
- `getFileExtension(path)` - Extract file extension

## Usage

### Direct Imports
```typescript
import { runBritescript, importBritescript } from "./src/runtime";

const module = await importBritescript("./file.bs");
await runBritescript("./script.bs");
```

### Global Setup
```typescript
import { setupGlobalBritescript } from "./src/runtime";

setupGlobalBritescript();

// Now available globally:
await importBs("./file.bs");
await runBs("./script.bs");
```

### Utilities
```typescript
import { pipe, isBritescriptFile } from "./src/runtime";

const result = pipe("  hello  ", s => s.trim(), s => s.toUpperCase());
// result: "HELLO"

if (isBritescriptFile("example.bs")) {
  // Handle Britescript file
}
```

## CLI Integration

The `bs` executable uses this runtime to provide seamless .bs file execution:

```bash
./bs your-file.bs
```

This automatically compiles and executes Britescript files with full trait and struct support.