# Britescript

Britescript is a modern language that compiles to TypeScript. It supports both Britescript-specific syntax and regular TypeScript/JavaScript code in the same file.

## Installation

### Install the CLI

```bash
bun install -g @britescript/cli
```

### Using the CLI

```bash
# Create a new project
brite init my-app
cd my-app

# Compile a file
brite compile main.bs

# Watch and recompile on changes
brite compile main.bs --watch

# Run Britescript directly
brite run main.bs

# Start interactive REPL
brite repl

# Show all available commands
brite help
```

### Vite Plugin Setup

For Vite projects, install the plugin:

```bash
bun add -D @britescript/vite
```

Configure your vite.config.ts:

```typescript
import { defineConfig } from 'vite'
import { britescript } from '@britescript/vite'

export default defineConfig({
  plugins: [
    britescript({
      jsx: true, // Enable JSX support for .bsx files
    }),
    // ... other plugins
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.bsx', '.bs']
  }
})
```

Now you can import .bs and .bsx files directly in your Vite project!

## Struct Declarations

Define data structures with clean syntax that compiles to TypeScript types:

**Britescript:**
```javascript
struct User {
  id: number;
  name: string;
  email: string;
}

struct Container<T> {
  value: T;
}
```

**Generated TypeScript:**
```typescript
type User = {
  id: number;
  name: string;
  email: string;
}

type Container<T> = {
  value: T;
}
```

## Traits

Define interfaces with trait declarations that compile to TypeScript interfaces:

**Britescript:**
```javascript
trait Display {
  show(): string;
}

trait Container<T> {
  get(): T;
  set(value: T): void;
}
```

**Generated TypeScript:**
```typescript
interface Display {
  show(): string;
}

interface Container<T> {
  get(): T;
  set(value: T): void;
}
```

## Trait Implementations

Implement traits for your structs with functional object generation:

**Britescript:**
```javascript
trait Display {
  show(): string;
}

struct User {
  id: number;
  name: string;
}

impl Display for User {
  show() {
    return `User #${this.id}: ${this.name}`;
  }
}
```

**Generated TypeScript:**
```typescript
interface Display {
  show(): string;
}

type User = {
  id: number;
  name: string;
}

const UserDisplay = {
  show: (obj: User): string => {
    return "Hello " + obj.name;
  }
};
```

## Atoms

Use Elixir-style atoms for immutable constants:

**Britescript:**
```javascript
let status = :ok
let error_type = :network_error
let state = :running
```

**Generated TypeScript:**
```typescript
const status = Symbol.for("ok");
const error_type = Symbol.for("network_error");
const state = Symbol.for("running");
```

Atoms are perfect for status values, configuration keys, and constants:

```javascript
// Status handling with atoms
function handleApiResponse(status: symbol) {
  switch (status) {
    case Symbol.for("success"):
      return "Operation completed";
    case Symbol.for("error"):
      return "Something went wrong";
    case Symbol.for("pending"):
      return "Processing...";
    default:
      return "Unknown status";
  }
}

// Usage
let result = :success;
console.log(handleApiResponse(result)); // "Operation completed"
```

## Pattern Matching

Powerful pattern matching inspired by Rust and Elixir:

**Britescript:**
```javascript
let result = match status {
  :ok => "Success!"
  :error => "Failed!"
  :pending => "Working..."
  _ => "Unknown status"
}

// With literals
let message = match code {
  200 => "OK"
  404 => "Not Found"
  500 => "Server Error"
  _ => "Unknown Code"
}

// Variable binding
let doubled = match value {
  x => x * 2
}
```

**Generated TypeScript:**
```typescript
const result = (() => {
  const __match_value = status;
  if (__match_value === Symbol.for("ok")) {
    return "Success!";
  } else if (__match_value === Symbol.for("error")) {
    return "Failed!";
  } else if (__match_value === Symbol.for("pending")) {
    return "Working...";
  } else {
    return "Unknown status";
  }
  throw new Error("Non-exhaustive match");
})();

const message = (() => {
  const __match_value = code;
  if (__match_value === 200) {
    return "OK";
  } else if (__match_value === 404) {
    return "Not Found";
  } else if (__match_value === 500) {
    return "Server Error";
  } else {
    return "Unknown Code";
  }
  throw new Error("Non-exhaustive match");
})();

const doubled = (() => {
  const __match_value = value;
  if (true) {
    return __match_value * 2;
  }
  throw new Error("Non-exhaustive match");
})();
```

Pattern matching supports:
- **Atom patterns**: `:ok`, `:error`, `:pending`
- **Literal patterns**: Numbers, strings, booleans
- **Variable binding**: Capture values with identifiers
- **Wildcard patterns**: `_` matches anything
- **Exhaustiveness checking**: Throws error for non-exhaustive matches

## Pipe Expressions

Chain function calls with the pipe operator:

**Britescript:**
```javascript
let message = "  hello world  "
message |> trim |> toUpperCase |> console.log

// Multi-line pipes
let announcement = "  britescript is awesome  "
announcement 
  |> trim 
  |> toUpperCase 
  |> console.log
```

**Generated TypeScript:**
```typescript
const message = "  hello world  ";
console.log(message.trim().toUpperCase());

// Multi-line pipes
const announcement = "  britescript is awesome  ";
console.log(announcement.trim().toUpperCase());
```

## Mixed Code

Use regular JavaScript/TypeScript alongside Britescript:

```typescript
// Regular TypeScript/JavaScript
function createUser(name: string, email: string): User {
  return {
    id: Date.now(),
    name,
    email,
  };
}

// Britescript traits and structs
trait Display {
  show(): string;
}

struct User {
  id: number;
  name: string;
  email: string;
}

impl Display for User {
  show() {
    return `User: ${this.name} (${this.email})`;
  }
}

// Mixed usage with pipes
const users: User[] = [
  createUser("Alice", "alice@example.com"),
  createUser("Bob", "bob@example.com"),
];

let message = "Processing users..."
message |> console.log

users.forEach(user => {
  user.show() |> console.log;
});
```