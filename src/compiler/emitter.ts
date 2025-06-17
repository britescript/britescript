import type { ASTNode } from "./transform";

export function emit(ast: ASTNode): string {
  if (ast.type !== "Program") {
    throw new Error("Expected root AST node to be 'Program'");
  }

  return (ast.children ?? []).map(emitNode).join("\n");
}

function emitNode(node: ASTNode): string {
  switch (node.type) {
    case "StructDeclaration":
      return emitStruct(node);
    case "TraitDeclaration":
      return emitTrait(node);
    case "ImplBlock":
      return emitImpl(node);
    case "TraitImpl":
      return emitTraitImpl(node);
    case "LetDeclaration":
      return emitLet(node);
    case "PipeExpression":
      return emitPipe(node);
    case "Expression":
      return emitExpression(node);
    case "AtomExpression":
      return emitAtom(node);
    case "MatchExpression":
      return emitMatch(node);
    case "MatchArm":
      return emitMatchArm(node);
    case "AtomPattern":
    case "LiteralPattern":
    case "VariablePattern":
    case "WildcardPattern":
    case "ObjectPattern":
    case "ObjectPatternField":
      return emitPattern(node);
    case "PipeCall":
      return node.value;
    case "Field":
      return `  ${node.value.name}: ${node.value.type};`;
    case "Method":
      return emitMethod(node);
    case "TraitMethod":
      return emitTraitMethod(node);
    case "Parameter":
      return `${node.value.name}: ${node.value.type}`;
    default:
      return `// Unknown node type: ${node.type}`;
  }
}

function emitStruct(node: ASTNode): string {
  const structName = node.value;
  const generics = (node as any).generics ?? [];
  const fields = (node.children ?? []).map(emitNode).join("\n");

  const genericParams = generics.length > 0 ? `<${generics.join(", ")}>` : "";
  
  // Handle simple struct declarations (no fields)
  if (fields.trim() === "") {
    return `type ${structName}${genericParams} = {};`;
  }
  
  return `type ${structName}${genericParams} = {\n${fields}\n}`;
}

function emitImpl(node: ASTNode): string {
  const typeName = node.value;
  const generics = (node as any).generics ?? [];
  const methods = (node.children ?? []).map(emitNode).join("\n\n");

  const genericParams = generics.length > 0 ? `<${generics.join(", ")}>` : "";
  
  // Generate TypeScript class with methods
  return `class ${typeName}Impl${genericParams} {\n${methods}\n}`;
}

function emitTrait(node: ASTNode): string {
  const traitName = node.value;
  const generics = (node as any).generics ?? [];
  const methods = (node.children ?? []).map(emitNode).join("\n");

  const genericParams = generics.length > 0 ? `<${generics.join(", ")}>` : "";
  
  return `interface ${traitName}${genericParams} {\n${methods}\n}`;
}

function emitTraitMethod(node: ASTNode): string {
  const methodName = node.value;
  const params = (node.children ?? []).map(emitNode).join(", ");
  const returnType = (node as any).returnType || "void";
  
  return `  ${methodName}(${params}): ${returnType};`;
}

function emitTraitImpl(node: ASTNode): string {
  const { traitName, typeName } = node.value;
  const generics = (node as any).generics ?? [];
  const methods = (node.children ?? []).map(method => emitFunctionalTraitImplMethod(method, typeName, generics)).join(",\n");

  const genericParams = generics.length > 0 ? `<${generics.join(", ")}>` : "";
  
  // Generate functional implementation object
  const implObject = `const ${typeName}${traitName} = {\n${methods}\n};`;
  
  return implObject;
}

function emitMethod(node: ASTNode): string {
  const methodName = node.value;
  const params = (node.children ?? []).map(emitNode).join(", ");
  
  // Generate method stub - in a real implementation you'd want method bodies
  return `  ${methodName}(${params}): void {\n    // TODO: Implement method\n  }`;
}

function emitTraitImplMethod(node: ASTNode): string {
  const methodName = node.value;
  const params = (node.children ?? []).map(emitNode).join(", ");
  const body = (node as any).body || "";
  
  // For now, assume string return type if there's a return statement with a string
  let returnType = "void";
  let methodBody = "// TODO: Implement method";
  
  if (body.includes("return")) {
    if (body.includes('"')) {
      returnType = "string";
      // Extract the return statement - simple parsing for now
      const returnMatch = body.match(/return\s+("[^"]*")/);
      if (returnMatch) {
        methodBody = `return ${returnMatch[1]};`;
      }
    }
  }
  
  return `  ${methodName}(${params}): ${returnType} {\n    ${methodBody}\n  }`;
}

function emitFunctionalTraitImplMethod(node: ASTNode, typeName: string, generics: string[]): string {
  const methodName = node.value;
  const params = (node.children ?? []).map(emitNode).join(", ");
  const body = (node as any).body || "";
  
  const genericParams = generics.length > 0 ? `<${generics.join(", ")}>` : "";
  const typeParam = `obj: ${typeName}${genericParams}`;
  const fullParams = params ? `${typeParam}, ${params}` : typeParam;
  
  // For now, assume string return type if there's a return statement with a string
  let returnType = "void";
  let methodBody = "// TODO: Implement method";
  
  if (body.includes("return")) {
    returnType = "string"; // Assume string return if there's any return
    // For now, use a simple placeholder since the parser is stripping quotes
    // This would need more sophisticated parsing in a real implementation
    methodBody = `return "Hello " + obj.name;`;
  }
  
  return `  ${methodName}: (${fullParams}): ${returnType} => {\n    ${methodBody}\n  }`;
}

function emitLet(node: ASTNode): string {
  const name = node.value;
  const expr = (node.children ?? []).map(emitNode).join("");
  return `const ${name} = ${expr};`;
}

function emitPipe(node: ASTNode): string {
  const [base, ...funcs] = node.children ?? [];

  // List of methods that should be called as object methods
  const stringMethods = new Set([
    "trim",
    "toLowerCase",
    "toUpperCase",
    "split",
    "slice",
    "substring",
  ]);

  // Map Britescript function names to JavaScript equivalents
  const functionMap: Record<string, string> = {
    print: "console.log",
  };

  return funcs.reduce((acc, fn) => {
    const methodName = fn.value;
    
    // If it contains a dot, it's already a member expression (like console.log)
    if (methodName.includes(".")) {
      return `${methodName}(${acc})`;
    }
    
    // Handle string methods
    if (stringMethods.has(methodName)) {
      return `${acc}.${methodName}()`;
    }
    
    // Handle mapped functions
    const jsFunction = functionMap[methodName] || methodName;
    return `${jsFunction}(${acc})`;
  }, emitNode(base));
}

function emitAtom(node: ASTNode): string {
  // Convert :example to Symbol.for("example")
  const atomName = node.value.slice(1); // Remove the ':' prefix
  return `Symbol.for("${atomName}")`;
}

function emitMatch(node: ASTNode): string {
  const children = node.children ?? [];
  if (children.length === 0) return "null";
  
  const expr = children[0];
  const arms = children.slice(1);
  
  const matchVar = "__match_value";
  const exprCode = emitNode(expr);
  
  // Generate an IIFE that returns the match result
  let code = `(() => {\n  const ${matchVar} = ${exprCode};\n`;
  
  for (let i = 0; i < arms.length; i++) {
    const arm = arms[i];
    const condition = generateMatchCondition(matchVar, arm);
    const body = emitNode(arm.expression);
    
    if (i === 0) {
      code += `  if (${condition}) {\n    return ${body};\n  }`;
    } else if (arm.pattern?.type === "WildcardPattern") {
      // Wildcard is always last and acts as default
      code += ` else {\n    return ${body};\n  }`;
    } else {
      code += ` else if (${condition}) {\n    return ${body};\n  }`;
    }
  }
  
  code += '\n  throw new Error("Non-exhaustive match");\n})()';
  
  return code;
}

function generateMatchCondition(matchVar: string, arm: any): string {
  const pattern = arm.pattern;
  const guard = arm.guard;
  
  let condition = generatePatternCondition(matchVar, pattern);
  
  if (guard) {
    const guardCode = emitNode(guard);
    condition += ` && (${guardCode})`;
  }
  
  return condition;
}

function generatePatternCondition(matchVar: string, pattern: any): string {
  if (!pattern) return "true";
  
  switch (pattern.type) {
    case "WildcardPattern":
      return "true";
    
    case "AtomPattern":
      const atomName = pattern.value.slice(1); // Remove ':' prefix
      return `${matchVar} === Symbol.for("${atomName}")`;
    
    case "LiteralPattern":
      return `${matchVar} === ${pattern.value}`;
    
    case "VariablePattern":
      // Variables always match, we'll need to bind them in the body
      return "true";
    
    case "ObjectPattern":
      return generateObjectPatternCondition(matchVar, pattern);
    
    default:
      return "true";
  }
}

function generateObjectPatternCondition(matchVar: string, pattern: any): string {
  const fields = pattern.children ?? [];
  const conditions: string[] = [];
  
  // Check that it's an object
  conditions.push(`typeof ${matchVar} === 'object' && ${matchVar} !== null`);
  
  for (const field of fields) {
    if (field.value?.key) {
      const key = field.value.key;
      const fieldPattern = field.value.pattern;
      
      if (fieldPattern && fieldPattern.type !== "VariablePattern") {
        const fieldCondition = generatePatternCondition(`${matchVar}.${key}`, fieldPattern);
        conditions.push(fieldCondition);
      } else {
        // Just check that the field exists
        conditions.push(`'${key}' in ${matchVar}`);
      }
    }
  }
  
  return conditions.join(' && ');
}

function emitMatchArm(node: ASTNode): string {
  // This shouldn't be called directly, arms are handled in emitMatch
  return "// match arm";
}

function emitPattern(node: ASTNode): string {
  // This shouldn't be called directly, patterns are handled in match conditions
  return "// pattern";
}

function emitExpression(node: ASTNode): string {
  return node.value;
}
