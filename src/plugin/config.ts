// Plugin configuration and constants

export const PLUGIN_NAME = "britescript";

export const FILE_FILTER = /\.(bs|bsx)$/;

export const DEFAULT_CONFIG = {
  // Plugin configuration options can be added here
  outputLoader: "ts" as const,
  enableSourceMaps: false,
  enableMinification: false,
};
