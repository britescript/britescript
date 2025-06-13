# Britescript Bun Plugin

This folder contains the Bun plugin implementation for Britescript, organized into focused modules.

## Structure

- **`index.ts`** - Main plugin entry point and exports
- **`loader.ts`** - File loading and compilation logic
- **`config.ts`** - Plugin configuration and constants  
- **`types.ts`** - TypeScript type definitions

## Usage

```typescript
import { britescriptPlugin } from "./src/plugin";

const result = await Bun.build({
  entrypoints: ["./app.bs"],
  plugins: [britescriptPlugin],
});
```

## Architecture

1. **Plugin Registration**: `index.ts` defines the plugin and registers file handlers
2. **File Filtering**: Uses regex `/\.bs$/` to match `.bs` files
3. **Compilation**: `loader.ts` handles reading and compiling `.bs` files
4. **Error Handling**: Provides structured error messages with file locations
5. **Output**: Returns compiled TypeScript with `loader: "ts"` for proper processing

## Configuration

The plugin uses minimal configuration by default but can be extended in `config.ts` for:
- Custom output loaders
- Source map generation
- Minification options
- Additional compilation flags