# Britescript Examples 🚀

This directory contains comprehensive examples showcasing all of Britescript's features and capabilities. Each example is fully functional and demonstrates real-world usage patterns.

## Examples Overview

### 📚 Basic Features (`basic-features.bs`)
**Perfect starting point** - Demonstrates core Britescript syntax:
- ✅ Trait definitions and implementations
- ✅ Struct declarations with typed fields
- ✅ Impl blocks with method definitions
- ✅ Pipe operations and chaining
- ✅ Mixed TypeScript/JavaScript integration

**Key concepts:** Traits, structs, pipes, basic impl blocks

### 🔧 Generics Showcase (`generics-showcase.bs`)
**Advanced type system** - Shows generic programming features:
- ✅ Generic structs with type parameters
- ✅ Generic trait implementations  
- ✅ Type-safe containers and collections
- ✅ Result/Option patterns from Rust
- ✅ Complex generic constraints

**Key concepts:** Generics, type safety, container patterns

### 🌐 Web Components (`web-components.bs`)
**Frontend development** - Building interactive web applications:
- ✅ DOM manipulation traits
- ✅ Component rendering systems
- ✅ Event handling and interaction
- ✅ Form validation patterns
- ✅ Card components and UI elements

**Key concepts:** Web development, DOM manipulation, component patterns

### 📊 Data Processing (`data-processing.bs`)
**Data analysis pipeline** - Real-world data transformation:
- ✅ Functional data pipelines
- ✅ Filtering and aggregation traits
- ✅ Analytics and statistics
- ✅ Currency formatting and display
- ✅ Complex pipe operation chains

**Key concepts:** Data pipelines, functional programming, aggregation

### 🎯 Mixed Syntax (`mixed-syntax.bs`)
**Language integration** - Seamless TypeScript/Britescript collaboration:
- ✅ TypeScript interfaces and types
- ✅ Class definitions alongside traits
- ✅ Async/await with Britescript features
- ✅ Complex application architecture
- ✅ Real-world project structure

**Key concepts:** Language interop, async patterns, architecture

### 🔧 CLI Tool (`cli-tool.bs`)
**Command-line applications** - Building professional CLI tools:
- ✅ Argument parsing and validation
- ✅ Configuration management
- ✅ Logging and error handling
- ✅ Command pattern implementation
- ✅ File processing pipelines

**Key concepts:** CLI development, command patterns, configuration

### 🎨 Advanced Patterns (`advanced-patterns.bs`)
**Expert-level features** - Complex design patterns and techniques:
- ✅ Monadic error handling (Maybe type)
- ✅ Event-driven architecture
- ✅ Async processing queues
- ✅ Functional composition
- ✅ Smart caching with observers
- ✅ Serialization patterns

**Key concepts:** Advanced patterns, functional programming, architecture

## Running the Examples

### Option 1: Using the CLI
```bash
# Run any example directly
brite run examples/basic-features.bs

# Run with watch mode for development
brite run examples/web-components.bs --watch

# Run silently (no setup messages)
brite run examples/data-processing.bs --silent
```

### Option 2: Using the REPL
```bash
# Start interactive REPL
brite repl

# In REPL, copy and paste example code
# Or load entire examples:
bs> await importBs('./examples/basic-features.bs')
```

### Option 3: Direct Execution
```bash
# Using the bs wrapper (if available)
./bs examples/mixed-syntax.bs
```

## Example Structure

Each example follows this pattern:

```britescript
// Comment explaining the example's purpose
// Lists key features demonstrated

// Trait definitions
trait ExampleTrait {
  method(): ReturnType;
}

// Struct definitions  
struct ExampleStruct {
  field: Type;
}

// Trait implementations
impl ExampleTrait for ExampleStruct {
  method() {
    // Implementation
  }
}

// TypeScript/JavaScript integration
const data: ExampleStruct[] = [];

// Pipe operations and demos
let result = data |> process |> display;

// Console output showing results
console.log("🎉 Example complete!");
```

## Learning Path

**Recommended order for learning Britescript:**

1. **Start here:** `basic-features.bs` - Core syntax and concepts
2. **Type system:** `generics-showcase.bs` - Advanced typing
3. **Real app:** `web-components.bs` - Practical web development
4. **Data work:** `data-processing.bs` - Functional programming
5. **Integration:** `mixed-syntax.bs` - TypeScript collaboration
6. **Tools:** `cli-tool.bs` - Command-line applications
7. **Expert level:** `advanced-patterns.bs` - Complex patterns

## Key Features Demonstrated

### 🎯 Core Language Features
- **Traits** - Interface definitions with method signatures
- **Structs** - Type-safe data structures with fields
- **Impl blocks** - Method implementations for structs
- **Generics** - Type parameters and constraints
- **Pipes** - Functional operation chaining

### 🔧 Advanced Features
- **Mixed syntax** - Seamless TypeScript/JavaScript integration
- **Error handling** - Result types and Maybe monads
- **Async programming** - Promises and async/await
- **Event systems** - Observer patterns and event buses
- **Functional programming** - Composition and pipelines

### 🌟 Real-world Patterns
- **Component architecture** - Reusable UI components
- **Data processing** - ETL pipelines and analytics
- **CLI development** - Professional command-line tools
- **Web applications** - Interactive frontend development
- **System design** - Event-driven and functional architectures

## Output Examples

Each example produces rich console output showing:
- ✅ **Feature demonstrations** with clear explanations
- 📊 **Data transformations** step by step
- 🎯 **Results** of operations and computations
- 🚀 **Success messages** confirming functionality

## Next Steps

After exploring these examples:

1. **Create your own projects** using `brite init`
2. **Mix and match patterns** from different examples
3. **Build real applications** with Britescript
4. **Contribute examples** for specific use cases
5. **Share your creations** with the community

Happy coding with Britescript! 🎉