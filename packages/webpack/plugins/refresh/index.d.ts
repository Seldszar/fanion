import { Compiler } from "webpack";

declare namespace RefreshPlugin {
  interface Options {
    /**
     * Server address.
     */
    address?: string;

    /**
     * Server port.
     */
    port?: number;
  }
}

declare class RefreshPlugin {
  /**
   * Creates a new refresh plugin.
   * @param options the plugin options
   */
  constructor(options: RefreshPlugin.Options);

  /**
   * Applies the plugin to the compiler.
   * @param compiler the Webpack compiler
   */
  apply(compiler: Compiler): void;
}

export = RefreshPlugin;
