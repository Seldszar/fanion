import Config from "webpack-chain";
import webpack from "webpack";

/**
 * A variant handler.
 * @param config the Webpack configuration
 * @param context the context
 */
export type VariantHandler = (config: Config, context: VariantContext) => void;

/**
 * TypeScript options.
 */
export interface TypescriptOptions {
  /**
   * Path to the TypeScript configuration file.
   */
  configFile?: string;
}

/**
 * Variant options.
 */
export interface VariantOptions {
  /**
   * Path patterns used as entries.
   */
  source: string | string[];

  /**
   * Presets applied to the variant Webpack configuration.
   */
  use?: VariantHandler | VariantHandler[];

  /**
   * The path to the HTML template used for generating dahboard and graphics pages.
   */
  template?: string;

  /**
   * The base path.
   * @see https://webpack.js.org/configuration/entry-context/#context
   */
  basePath?: string;

  /**
   * The TypeScript options.
   */
  typescript?: TypescriptOptions;
}

/**
 * Variant context.
 */
export interface VariantContext {
  /**
   * The name.
   */
  name: string;

  /**
   * The options.
   */
  options: VariantOptions;

  /**
   * Indicates if the compiler is in production mode.
   */
  isProduction: boolean;

  /**
   * Indicates if the compiler is in watch mode.
   */
  isWatching: boolean;
}

/**
 * Global options.
 */
export interface Options {
  /**
   * Variant used by the project.
   */
  variants: Record<"dashboard" | "extension" | "graphics", VariantOptions>;

  /**
   * Function called at the end for updating the variant Webpack configuration.
   */
  webpack?: VariantHandler;
}

/**
 * Generates a new Webpack configuration.
 * @param options the options
 */
export function configure(options: Options): () => webpack.Configuration[];
