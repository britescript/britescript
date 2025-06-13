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

function transformExpression(cst: CstElement): ASTNode {
  // Handle token directly if it's already a token
  if ("image" in cst && cst.image !== undefined) {
    return {
      type: "Expression",
      value: cst.image,
    };
  }

  // Handle CST node
  if (isCstNode(cst)) {
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
