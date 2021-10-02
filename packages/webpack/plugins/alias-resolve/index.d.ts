import { Compiler } from "webpack";

declare namespace AliasResolvePlugin {
  interface Options {
    /**
     * Base URL used for resolving paths.
     */
    baseUrl?: string;

    /**
     * Collection of alias paths.
     */
    paths?: Record<string, string>;
  }
}

declare class AliasResolvePlugin {
  /**
   * Creates a new alias resolve plugin.
   * @param options the plugin options
   */
  constructor(options: AliasResolvePlugin.Options);

  /**
   * Applies the plugin to the compiler.
   * @param compiler the Webpack compiler
   */
  apply(compiler: Compiler): void;
}

export = AliasResolvePlugin;
