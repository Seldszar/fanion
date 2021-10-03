import Config from "webpack-chain";
import webpack from "webpack";

declare namespace fanion {
  /**
   * A variant handler.
   * @param config the Webpack configuration
   * @param context the context
   */
  type VariantHandler = (config: Config, context: VariantContext) => void;

  /**
   * Variant options.
   */
  interface VariantOptions {
    /**
     * Base directory of the variant.
     */
    base?: string;

    /**
     * Path patterns used as entries.
     */
    source: string | string[];

    /**
     * Presets applied to the variant Webpack configuration.
     */
    use?: VariantHandler | VariantHandler[];

    /**
     * Path to the HTML template used for generating dahboard and graphics pages.
     */
    template?: string;
  }

  /**
   * Variant context.
   */
  interface VariantContext {
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
  interface Options {
    /**
     * Variant used by the project.
     */
    variants: Record<"dashboard" | "extension" | "graphics", VariantOptions>;

    /**
     * Function called at the end for updating the variant Webpack configuration.
     */
    webpack?: VariantHandler;
  }
}

/**
 * Generates a new Webpack configuration.
 * @param options the options
 */
declare function fanion(options: fanion.Options): () => webpack.Configuration[];

export = fanion;
