import type { CstElement, CstNode } from "chevrotain";

export type ASTNode = {
  type: string;
  value?: any;
  children?: ASTNode[];
};

function isCstNode(element: CstElement): element is CstNode {
  return (element as CstNode).name !== undefined;
}

export function transform(cst: CstNode): ASTNode {
  const children: ASTNode[] = [];

  const programChildren = cst.children.statement ?? [];

  for (const statementNode of programChildren) {
    if (isCstNode(statementNode)) {
      if (statementNode.name === "structDecl") {
        children.push(transformStruct(statementNode));
      } else if (statementNode.name === "traitDecl") {
        children.push(transformTrait(statementNode));
      } else if (statementNode.name === "implBlock") {
        children.push(transformImpl(statementNode));
      } else if (statementNode.name === "traitImpl") {
        children.push(transformTraitImpl(statementNode));
      } else if (statementNode.name === "letDecl") {
        children.push(transformLet(statementNode));
      } else if (statementNode.name === "pipeExpr") {
        children.push(transformPipe(statementNode));
      } else if (statementNode.name === "matchExpr") {
        children.push(transformMatch(statementNode));
      }
    }
  }

  return {
    type: "Program",
    children,
  };
}

function transformStruct(cst: CstNode): ASTNode {
  const identifiers = cst.children.Identifier ?? [];
  const genericsArray = cst.children.generics ?? [];
  const fieldTokens = cst.children.fields ?? [];
  
  // First identifier is the struct name
  const [nameToken] = identifiers;
  
  // Extract generics from the generics array, not from identifiers
  const generics = genericsArray.map((g: any) => g && "image" in g ? g.image : "");

  const fields: ASTNode[] = [];
  for (let i = 0; i < fieldTokens.length; i += 2) {
    const nameToken = fieldTokens[i];
    const typeToken = fieldTokens[i + 1];
    if (nameToken && typeToken) {
      fields.push({
        type: "Field",
        value: {
          name: nameToken && "image" in nameToken ? nameToken.image : "",
          type: typeToken && "image" in typeToken ? typeToken.image : "",
        },
      });
    }
  }

  return {
    type: "StructDeclaration",
    value: nameToken && "image" in nameToken ? nameToken.image : "",
    children: fields,
    generics: generics,
  };
}

function transformImpl(cst: CstNode): ASTNode {
  const identifiers = cst.children.Identifier ?? [];
  const genericsArray = cst.children.generics ?? [];
  const methods = cst.children.methodDecl ?? [];
  
  // First identifier is the type name
  const [typeNameToken] = identifiers;
  
  // Extract generics from the generics array
  const generics = genericsArray.map((g: any) => g && "image" in g ? g.image : "");

  const methodNodes = methods.map((method: any) => transformMethod(method));

  return {
    type: "ImplBlock",
    value: typeNameToken && "image" in typeNameToken ? typeNameToken.image : "",
    children: methodNodes,
    generics: generics,
  };
}

function transformTrait(cst: CstNode): ASTNode {
  const identifiers = cst.children.Identifier ?? [];
  const genericsArray = cst.children.generics ?? [];
  const methods = cst.children.traitMethodDecl ?? [];
  
  const [nameToken] = identifiers;
  const generics = genericsArray.map((g: any) => g && "image" in g ? g.image : "");
  const methodNodes = methods.map((method: any) => transformTraitMethod(method));

  return {
    type: "TraitDeclaration",
    value: nameToken && "image" in nameToken ? nameToken.image : "",
    children: methodNodes,
    generics: generics,
  };
}

function transformTraitMethod(cst: CstNode): ASTNode {
  const identifiers = cst.children.Identifier ?? [];
  const [nameToken, ...tokens] = identifiers;
  
  // Parse parameters (pairs of name:type) and return type (last token)
  const paramTokens = tokens.slice(0, -1);
  const returnTypeToken = tokens[tokens.length - 1];
  
  const params: ASTNode[] = [];
  for (let i = 0; i < paramTokens.length; i += 2) {
    const paramName = paramTokens[i];
    const paramType = paramTokens[i + 1];
    params.push({
      type: "Parameter",
      value: {
        name: paramName && "image" in paramName ? paramName.image : "",
        type: paramType && "image" in paramType ? paramType.image : "",
      },
    });
  }

  return {
    type: "TraitMethod",
    value: nameToken && "image" in nameToken ? nameToken.image : "",
    children: params,
    returnType: returnTypeToken && "image" in returnTypeToken ? returnTypeToken.image : "void",
  };
}

function transformTraitImpl(cst: CstNode): ASTNode {
  const traitNames = cst.children.traitName ?? [];
  const typeNames = cst.children.typeName ?? [];
  const genericsArray = cst.children.generics ?? [];
  const methods = cst.children.methodDecl ?? [];
  
  const [traitNameToken] = traitNames;
  const [typeNameToken] = typeNames;
  const generics = genericsArray.map((g: any) => g && "image" in g ? g.image : "");
  const methodNodes = methods.map((method: any) => transformMethod(method));

  return {
    type: "TraitImpl",
    value: {
      traitName: traitNameToken && "image" in traitNameToken ? traitNameToken.image : "",
      typeName: typeNameToken && "image" in typeNameToken ? typeNameToken.image : "",
    },
    children: methodNodes,
    generics: generics,
  };
}

function transformMethod(cst: CstNode): ASTNode {
  const identifiers = cst.children.Identifier ?? [];
  const bodyTokens = cst.children.body ?? [];
  const [nameToken, ...paramTokens] = identifiers;

  const params: ASTNode[] = [];
  for (let i = 0; i < paramTokens.length; i += 2) {
    const paramName = paramTokens[i];
    const paramType = paramTokens[i + 1];
    params.push({
      type: "Parameter",
      value: {
        name: paramName && "image" in paramName ? paramName.image : "",
        type: paramType && "image" in paramType ? paramType.image : "",
      },
    });
  }

  // Transform body tokens into a simple body representation
  const body = bodyTokens.map((token: any) => 
    token && "image" in token ? token.image : ""
  ).join(" ");

  return {
    type: "Method",
    value: nameToken && "image" in nameToken ? nameToken.image : "",
    children: params,
    body: body,
  };
}

function transformLet(cst: CstNode): ASTNode {
  const identifiers = cst.children.Identifier ?? [];
  const [nameToken] = identifiers;
  const exprNode = cst.children.expression?.[0];

  return {
    type: "LetDeclaration",
    value: nameToken && "image" in nameToken ? nameToken.image : "",
    children: exprNode ? [transformExpression(exprNode)] : [],
  };
}

function transformPipe(cst: CstNode): ASTNode {
  const baseExpr = transformExpression(cst.children.expression[0]);

  const memberExpressions = cst.children.memberExpression ?? [];
  const pipeCalls = memberExpressions.map((memberExpr: any) => {
    if (isCstNode(memberExpr)) {
      const identifiers = memberExpr.children.Identifier ?? [];
      const memberPath = identifiers.map((id: any) => 
        id && "image" in id ? id.image : ""
      ).join(".");
      
      return {
        type: "PipeCall",
        value: memberPath,
      };
    }
    return {
      type: "PipeCall",
      value: "",
    };
  });

  return {
    type: "PipeExpression",
    children: [baseExpr, ...pipeCalls],
  };
}

function transformMatch(cst: CstNode): ASTNode {
  const expressions = cst.children.expression ?? [];
  const arms = cst.children.matchArm ?? [];
  
  const expr = expressions.length > 0 ? transformExpression(expressions[0]) : null;
  const matchArms = arms.map((arm: any) => transformMatchArm(arm));
  
  return {
    type: "MatchExpression",
    children: [expr, ...matchArms].filter(Boolean),
  };
}

function transformMatchArm(cst: CstNode): ASTNode {
  const patterns = cst.children.pattern ?? [];
  const guards = cst.children.guard ?? [];
  const expressions = cst.children.expression ?? [];
  
  const pattern = patterns.length > 0 ? transformPattern(patterns[0]) : null;
  const guard = guards.length > 0 ? transformExpression(guards[0]) : null;
  const expr = expressions.length > 0 ? transformExpression(expressions[0]) : null;
  
  return {
    type: "MatchArm",
    children: [pattern, guard, expr].filter(Boolean),
    pattern: pattern,
    guard: guard,
    expression: expr,
  };
}

function transformPattern(cst: CstElement): ASTNode {
  // Handle token directly if it's already a token
  if ("image" in cst && cst.image !== undefined) {
    if (cst.image === '_') {
      return {
        type: "WildcardPattern",
        value: cst.image,
      };
    }
    if (cst.image.startsWith(':')) {
      return {
        type: "AtomPattern",
        value: cst.image,
      };
    }
    return {
      type: "VariablePattern",
      value: cst.image,
    };
  }

  // Handle CST node
  if (isCstNode(cst)) {
    if (cst.name === "objectPattern") {
      return transformObjectPattern(cst);
    }
    
    const wildcardToken = cst.children?.Underscore?.[0];
    if (wildcardToken) {
      return {
        type: "WildcardPattern",
        value: "_",
      };
    }
    
    const atomToken = cst.children?.AtomLiteral?.[0];
    if (atomToken && "image" in atomToken) {
      return {
        type: "AtomPattern",
        value: atomToken.image,
      };
    }

    const stringToken = cst.children?.StringLiteral?.[0];
    if (stringToken && "image" in stringToken) {
      return {
        type: "LiteralPattern",
        value: stringToken.image,
      };
    }

    const numberToken = cst.children?.NumberLiteral?.[0];
    if (numberToken && "image" in numberToken) {
      return {
        type: "LiteralPattern",
        value: numberToken.image,
      };
    }

    const identifierToken = cst.children?.Identifier?.[0];
    if (identifierToken && "image" in identifierToken) {
      return {
        type: "VariablePattern",
        value: identifierToken.image,
      };
    }
  }

  return {
    type: "VariablePattern",
    value: undefined,
  };
}

function transformObjectPattern(cst: CstNode): ASTNode {
  const fields = cst.children.field ?? [];
  const fieldNodes = fields.map((field: any) => transformObjectPatternField(field));
  
  return {
    type: "ObjectPattern",
    children: fieldNodes,
  };
}

function transformObjectPatternField(cst: CstNode): ASTNode {
  const keys = cst.children.key ?? [];
  const patterns = cst.children.pattern ?? [];
  
  const key = keys.length > 0 && "image" in keys[0] ? keys[0].image : "";
  const pattern = patterns.length > 0 ? transformPattern(patterns[0]) : null;
  
  return {
    type: "ObjectPatternField",
    value: { key, pattern },
    children: pattern ? [pattern] : [],
  };
}

function transformExpression(cst: CstElement): ASTNode {
  // Handle token directly if it's already a token
  if ("image" in cst && cst.image !== undefined) {
    // Check if it's an atom literal
    if (cst.image.startsWith(':')) {
      return {
        type: "AtomExpression",
        value: cst.image,
      };
    }
    return {
      type: "Expression",
      value: cst.image,
    };
  }

  // Handle CST node
  if (isCstNode(cst)) {
    // Handle match expressions
    if (cst.name === "matchExpr") {
      return transformMatch(cst);
    }
    
    const atomToken = cst.children?.AtomLiteral?.[0];
    if (atomToken && "image" in atomToken) {
      return {
        type: "AtomExpression",
        value: atomToken.image,
      };
    }

    const token =
      cst.children?.StringLiteral?.[0] ??
      cst.children?.NumberLiteral?.[0] ??
      cst.children?.Identifier?.[0];

    return {
      type: "Expression",
      value: token && "image" in token ? token.image : undefined,
    };
  }

  return {
    type: "Expression",
    value: undefined,
  };
}
