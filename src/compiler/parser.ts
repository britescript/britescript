import { type CstNode, EmbeddedActionsParser, Lexer, createToken } from "chevrotain";

// --------------------
// Tokens
// --------------------
const Struct = createToken({ name: "Struct", pattern: /struct/ });
const Trait = createToken({ name: "Trait", pattern: /trait/ });
const Impl = createToken({ name: "Impl", pattern: /impl/ });
const For = createToken({ name: "For", pattern: /for/ });
const Let = createToken({ name: "Let", pattern: /let/ });
const Return = createToken({ name: "Return", pattern: /return/ });
const LCurly = createToken({ name: "LCurly", pattern: /{/ });
const RCurly = createToken({ name: "RCurly", pattern: /}/ });
const LParen = createToken({ name: "LParen", pattern: /\(/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });
const LAngle = createToken({ name: "LAngle", pattern: /</ });
const RAngle = createToken({ name: "RAngle", pattern: />/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Dot = createToken({ name: "Dot", pattern: /\./ });
const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
const Pipe = createToken({ name: "Pipe", pattern: /\|>/ });
const Equals = createToken({ name: "Equals", pattern: /=/ });

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z_]\w*/ });
const NumberLiteral = createToken({ name: "NumberLiteral", pattern: /\d+/ });
const StringLiteral = createToken({ name: "StringLiteral", pattern: /"([^"\\]|\\.)*"/ });

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const allTokens = [
  WhiteSpace,
  Struct,
  Trait,
  Impl,
  For,
  Let,
  Return,
  LCurly,
  RCurly,
  LParen,
  RParen,
  LAngle,
  RAngle,
  Comma,
  Colon,
  Dot,
  Semicolon,
  Pipe,
  Equals,
  StringLiteral,
  NumberLiteral,
  Identifier,
];

export const BritescriptLexer = new Lexer(allTokens);

// --------------------
// Parser Class
// --------------------
class BritescriptParser extends EmbeddedActionsParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  program = this.RULE("program", () => {
    const statements = [];
    this.MANY(() => {
      statements.push(this.SUBRULE(this.statement));
    });
    return { name: "program", children: { statement: statements } };
  });

  statement = this.RULE("statement", () => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.structDecl) },
      { ALT: () => this.SUBRULE(this.traitDecl) },
      { ALT: () => this.SUBRULE(this.implBlock) },
      { ALT: () => this.SUBRULE(this.letDecl) },
      { ALT: () => this.SUBRULE(this.pipeExpr) },
    ]);
  });

  structDecl = this.RULE("structDecl", () => {
    this.CONSUME(Struct);
    const name = this.CONSUME(Identifier);
    
    // Optional generic parameters
    const generics: any[] = [];
    this.OPTION(() => {
      this.CONSUME(LAngle);
      generics.push(this.CONSUME2(Identifier));
      this.MANY(() => {
        this.CONSUME(Comma);
        generics.push(this.CONSUME3(Identifier));
      });
      this.CONSUME(RAngle);
    });

    // Support both simple struct declarations (struct User;) and full struct bodies
    const fields: any[] = [];
    this.OR([
      // Simple struct declaration: struct User;
      { ALT: () => this.CONSUME(Semicolon) },
      // Full struct body: struct User { ... } or struct User { ... };
      { ALT: () => {
        this.CONSUME(LCurly);
        this.MANY2(() => {
          fields.push(this.CONSUME4(Identifier));
          this.CONSUME(Colon);
          fields.push(this.CONSUME5(Identifier));
          // Optional semicolon after each field
          this.OPTION3(() => {
            this.CONSUME3(Semicolon);
          });
        });
        this.CONSUME(RCurly);
        // Optional semicolon after struct body
        this.OPTION2(() => {
          this.CONSUME2(Semicolon);
        });
      }}
    ]);

    return {
      name: "structDecl",
      children: { 
        Identifier: [name],
        generics: generics,
        fields: fields
      },
    };
  });

  traitDecl = this.RULE("traitDecl", () => {
    this.CONSUME(Trait);
    const name = this.CONSUME(Identifier);
    
    // Optional generic parameters
    const generics: any[] = [];
    this.OPTION(() => {
      this.CONSUME(LAngle);
      generics.push(this.CONSUME2(Identifier));
      this.MANY(() => {
        this.CONSUME(Comma);
        generics.push(this.CONSUME3(Identifier));
      });
      this.CONSUME(RAngle);
    });

    this.CONSUME(LCurly);

    const methods: any[] = [];
    this.MANY2(() => {
      methods.push(this.SUBRULE(this.traitMethodDecl));
    });

    this.CONSUME(RCurly);

    return {
      name: "traitDecl",
      children: { 
        Identifier: [name],
        generics: generics,
        traitMethodDecl: methods
      },
    };
  });

  traitMethodDecl = this.RULE("traitMethodDecl", () => {
    const name = this.CONSUME(Identifier);
    this.CONSUME(LParen);
    
    const params: any[] = [];
    this.OPTION(() => {
      params.push(this.CONSUME2(Identifier));
      this.CONSUME(Colon);
      params.push(this.CONSUME3(Identifier));
      this.MANY(() => {
        this.CONSUME(Comma);
        params.push(this.CONSUME4(Identifier));
        this.CONSUME2(Colon);
        params.push(this.CONSUME5(Identifier));
      });
    });
    
    this.CONSUME(RParen);
    this.CONSUME3(Colon);
    const returnType = this.CONSUME6(Identifier);
    this.CONSUME(Semicolon);

    return {
      name: "traitMethodDecl",
      children: { 
        Identifier: [name, ...params, returnType] 
      },
    };
  });

  implBlock = this.RULE("implBlock", () => {
    this.CONSUME(Impl);
    
    // Optional generic parameters
    const generics: any[] = [];
    this.OPTION(() => {
      this.CONSUME(LAngle);
      generics.push(this.CONSUME(Identifier));
      this.MANY(() => {
        this.CONSUME(Comma);
        generics.push(this.CONSUME2(Identifier));
      });
      this.CONSUME(RAngle);
    });

    // Handle both "impl Type" and "impl Trait for Type"
    const firstId = this.CONSUME3(Identifier);
    let traitName = null;
    let typeName = firstId;
    
    this.OPTION2(() => {
      this.CONSUME(For);
      traitName = firstId;
      typeName = this.CONSUME4(Identifier);
    });

    this.CONSUME(LCurly);

    const methods: any[] = [];
    this.MANY2(() => {
      methods.push(this.SUBRULE(this.methodDecl));
    });

    this.CONSUME(RCurly);

    if (traitName) {
      return {
        name: "traitImpl",
        children: {
          traitName: [traitName],
          typeName: [typeName],
          methodDecl: methods,
          generics: generics
        },
      };
    } else {
      return {
        name: "implBlock",
        children: {
          Identifier: [typeName, ...generics],
          methodDecl: methods,
          generics: generics
        },
      };
    }
  });

  methodDecl = this.RULE("methodDecl", () => {
    const name = this.CONSUME(Identifier);
    this.CONSUME(LParen);
    
    const params: any[] = [];
    this.OPTION(() => {
      params.push(this.CONSUME2(Identifier));
      this.CONSUME(Colon);
      params.push(this.CONSUME3(Identifier));
      this.MANY(() => {
        this.CONSUME2(Comma);
        params.push(this.CONSUME4(Identifier));
        this.CONSUME3(Colon);
        params.push(this.CONSUME5(Identifier));
      });
    });
    
    this.CONSUME(RParen);
    this.CONSUME(LCurly);
    
    // For now, consume all tokens until we find the closing brace
    // This is a simplified approach - in a full implementation we'd parse statements
    const bodyTokens: any[] = [];
    this.MANY2(() => {
      const token = this.OR([
        { ALT: () => this.CONSUME(Return) },
        { ALT: () => this.CONSUME(StringLiteral) },
        { ALT: () => this.CONSUME6(Identifier) },
        { ALT: () => this.CONSUME(Semicolon) },
        { ALT: () => this.CONSUME(Dot) },
        { ALT: () => this.CONSUME4(Comma) },
        { ALT: () => this.CONSUME4(Colon) },
        { ALT: () => this.CONSUME2(LParen) },
        { ALT: () => this.CONSUME2(RParen) },
      ]);
      bodyTokens.push(token);
    });
    
    this.CONSUME(RCurly);

    return {
      name: "methodDecl",
      children: { 
        Identifier: [name, ...params],
        body: bodyTokens
      },
    };
  });

  letDecl = this.RULE("letDecl", () => {
    this.CONSUME(Let);
    const id = this.CONSUME(Identifier);
    this.CONSUME(Equals);
    const expr = this.SUBRULE(this.expression);

    return {
      name: "letDecl",
      children: {
        Identifier: [id],
        expression: [expr],
      },
    };
  });

  pipeExpr = this.RULE("pipeExpr", () => {
    const base = this.SUBRULE(this.expression);

    const fns = [];
    this.AT_LEAST_ONE(() => {
      this.CONSUME(Pipe);
      fns.push(this.SUBRULE(this.memberExpression));
    });

    return {
      name: "pipeExpr",
      children: {
        expression: [base],
        memberExpression: fns,
      },
    };
  });

  memberExpression = this.RULE("memberExpression", () => {
    const parts = [];
    parts.push(this.CONSUME(Identifier));
    
    this.MANY(() => {
      this.CONSUME(Dot);
      parts.push(this.CONSUME2(Identifier));
    });

    return {
      name: "memberExpression",
      children: { Identifier: parts },
    };
  });

  expression = this.RULE("expression", () => {
    return this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(Identifier) },
    ]);
  });
}

const parser = new BritescriptParser();

// export functional entrypoint
export function parse(input: string): CstNode {
  const lexResult = BritescriptLexer.tokenize(input);
  parser.input = lexResult.tokens;

  const cst = parser.program();

  if (parser.errors.length > 0) {
    throw new Error(`Parsing failed:\n${parser.errors.map((e) => e.message).join("\n")}`);
  }

  return cst;
}
