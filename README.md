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