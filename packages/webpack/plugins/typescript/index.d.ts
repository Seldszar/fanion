import { Compiler } from "webpack";

declare namespace TypescriptPlugin {
  interface EmbeddedSource {
    /**
     * Content of the embedded file.
     */
    content: string;

    /**
     * Extension of the embedded file.
     */
    extension: ".js" | ".jsx" | ".ts" | ".tsx";

    /**
     * Path to the embedded file.
     */
    fileName: string;
  }

  interface EmbeddedParser {
    /**
     * Test assertion for using the embedded parser.
     */
    test: RegExp;

    /**
     * Parses a file.
     * @param fileName path to the embedded file
     * @param fileContent content of the embedded file
     */
    parse(fileName: string, fileContent: string): EmbeddedSource | null;
  }

  interface Options {
    /**
     * Custom path to the TypeScript configuration file.
     */
    configFile?: string;

    /**
     * A collection of embedded parsers.
     */
    embeddedParsers?: EmbeddedParser[];
  }
}

declare class TypescriptPlugin {
  /**
   * Creates a new TypeScript plugin.
   * @param options the plugin options
   */
  constructor(options: TypescriptPlugin.Options);

  /**
   * Applies the plugin to the compiler.
   * @param compiler the Webpack compiler
   */
  apply(compiler: Compiler): void;
}

export = TypescriptPlugin;
