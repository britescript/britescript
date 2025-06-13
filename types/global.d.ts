// Type declarations for Britescript files

declare module "*.bs" {
  // Default export for compiled Britescript modules
  const content: any;
  export default content;
  
  // Allow named exports from Britescript files
  export const [key: string]: any;
}

// Extend the global namespace with Britescript runtime helpers
declare global {
  /**
   * Import and execute a Britescript file
   * @param path Path to the .bs file
   */
  function importBs(path: string): Promise<any>;
  
  /**
   * Run a Britescript file
   * @param path Path to the .bs file
   */
  function runBs(path: string): Promise<void>;
}