# Britescript Build Process 🔨

This document explains how to build and distribute Britescript.

## Development Workflow

### Quick Development
```bash
# Run CLI directly from source (fast iteration)
bun run dev --help
bun run dev init my-project
bun run dev run examples/simple-demo.bs
```

### Build for Testing
```bash
# Build CLI to dist/ folder
bun run build

# Test the built CLI
./dist/brite --help
./dist/brite run examples/simple-demo.bs
```

### Clean Build
```bash
# Remove all build artifacts
bun run clean

# Fresh build
bun run build
```

## Release Process

### Full Release Build
```bash
# Creates production-ready package in dist/
bun run build:release
```

This creates:
- ✅ **Minified CLI** (`dist/brite`) - Executable CLI tool
- ✅ **Library build** (`dist/index.js`) - Importable compiler library  
- ✅ **Package metadata** (`dist/package.json`) - NPM package info
- ✅ **Documentation** (`dist/README.md`, `dist/INSTALL.md`)
- ✅ **Source maps** (`dist/*.js.map`) - For debugging
- ✅ **Test script** (`dist/test-release.ts`) - Validation

### Distribution
```bash
# Package for distribution
cd dist
npm pack

# Results in: britescript-0.0.1.tgz

# Publish to NPM (when ready)
npm publish
```

## Build Scripts

### `scripts/build-cli.ts`
- Builds CLI for development
- Creates `dist/brite` executable
- Fast build, no minification
- Includes source maps

### `scripts/build-release.ts`  
- Complete release build
- Minified for production
- Includes all metadata
- Ready for distribution

### `scripts/dev.ts`
- Development runner
- Runs CLI directly from source
- No build step required
- Fastest iteration

## Package Structure

### Development (src/)
```
src/
├── cli/index.ts          # CLI entry point
├── compiler/             # Language compiler
├── runtime/              # Runtime system
└── plugin/               # Bun plugin
```

### Distribution (dist/)
```
dist/
├── brite                 # ← Executable CLI
├── cli.js               # ← CLI implementation
├── index.js             # ← Library export
├── package.json         # ← NPM metadata
├── README.md            # ← Documentation
└── *.js.map            # ← Source maps
```

## Usage After Build

### Global Installation
```bash
# Install globally from built package
cd dist
npm install -g .

# Now available globally
brite --help
```

### Local Development
```bash
# Use built CLI locally
./dist/brite init my-project
./dist/brite run main.bs
```

### Library Import
```typescript
// Import as library
import { compile } from "britescript";

const typescript = compile("struct User { name: string }");
```

## Build Configuration

### Bun Build Options
- **Target**: `bun` (Bun runtime)
- **Format**: `esm` (ES modules)
- **Minification**: Dev=false, Release=true
- **Source maps**: Always included
- **Splitting**: Disabled for simpler distribution

### Entry Points
- **CLI**: `src/cli/index.ts` → `dist/cli.js`
- **Library**: `src/index.ts` → `dist/index.js`

## Troubleshooting

### Build Fails
```bash
# Clean and rebuild
bun run clean
bun run build

# Check for TypeScript errors
bun run dev --help
```

### CLI Not Working
```bash
# Test development version
bun run dev --version

# Check executable permissions
ls -la dist/brite
chmod +x dist/brite
```

### Size Issues
```bash
# Check bundle size
ls -lh dist/

# Analyze build output
bun build --analyze src/cli/index.ts
```

## Release Checklist

Before publishing:

1. ✅ **Version bump** - Update `package.json` version
2. ✅ **Build release** - `bun run build:release`
3. ✅ **Test CLI** - `./dist/brite --help`
4. ✅ **Test examples** - `./dist/brite run examples/simple-demo.bs`
5. ✅ **Check package** - `cd dist && npm pack`
6. ✅ **Documentation** - Update README if needed
7. ✅ **Git tag** - Tag the release version
8. ✅ **Publish** - `npm publish` from dist/

## Development Tips

### Fast Iteration
```bash
# Make changes to src/cli/
# Test immediately with:
bun run dev init test-project
```

### Build Testing
```bash
# Test both dev and built versions
bun run dev --version    # Development
./dist/brite --version   # Built
```

### Size Optimization
- Use `bun run build:release` for smallest bundles
- Source maps are separate files
- Minification reduces size by ~60%

Ready to build and ship! 🚀