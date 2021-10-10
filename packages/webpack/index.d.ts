import Config from "webpack-chain";
import webpack from "webpack";

declare namespace fanion {
  type ValueOrArray<T> = T | T[];

  /**
   * A variant handler.
   * @param config the Webpack configuration
   * @param context the context
   */
  type VariantHandler = (config: Config, context: VariantContext) => void;

  /**
   * A preset handler.
   * @param options the options
   */
  type PresetHandler<T = any> = (options: T) => VariantHandler;

  /**
   * A preset configuration.
   */
  interface PresetConfiguration<T = any> {
    /**
     * The preset handler.
     */
    preset: PresetHandler<T>;

    /**
     * The preset options.
     */
    options?: T;
  }

  /**
   * A Babel configuration.
   */
  interface BabelConfiguration {
    /**
     * Path to the configuration file.
     */
    configFile?: string;
  }

  /**
   * A TypeScript configuration.
   */
  interface TypeScriptConfiguration {
    /**
     * Path to the configuration file.
     */
    configFile?: string;
  }

  /**
   * Variant options.
   */
  interface VariantOptions {
    /**
     * Path patterns used as entries.
     */
    source: string | string[];

    /**
     * Presets applied to the variant Webpack configuration.
     */
    use?: ValueOrArray<PresetHandler | PresetConfiguration>;

    /**
     * Path to the HTML template used for generating view pages.
     */
    template?: string;

    /**
     * The Babel configuration.
     */
    babel?: BabelConfiguration;

    /**
     * The TypeScript configuration.
     */
    typescript?: TypeScriptConfiguration;
  }

  /**
   * A variant context.
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
