import { Compiler, EntryObject } from "webpack";

declare namespace EntryPlugin {
  /**
   * A formatted entry.
   */
  type FormattedEntry = EntryObject["main"];

  interface Options {
    /**
     * Formats the entry.
     * @param name the entry name
     * @param entry path to the entry file
     */
    format?(name: string, entry: string): FormattedEntry;
  }
}

declare class EntryPlugin {
  /**
   * Creates a new entry plugin.
   * @param source patterns for resolving the entry files
   * @param options the plugin options
   */
  constructor(source: string | string[], options: EntryPlugin.Options);

  /**
   * Applies the plugin to the compiler.
   * @param compiler the Webpack compiler
   */
  apply(compiler: Compiler): void;
}

export = EntryPlugin;
