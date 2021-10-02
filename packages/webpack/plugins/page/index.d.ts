import { Compiler } from "webpack";

declare namespace PagePlugin {
  interface PageDescriptor {
    /**
     * Content of the page template.
     */
    template: string;

    /**
     * Path to the generated page.
     * If you want to specify the current entry, you can use `[name]`.
     */
    filename: string;

    /**
     * A collection of entrypoints the page will handle.
     * If you want to specify the current entry, you can use `[name]`.
     */
    entrypoints: string[];

    /**
     * Indicates if a hash will appended to resources, useful for cache busting.
     */
    hash: boolean;
  }

  interface ResourceDescriptor {
    /**
     * Tag name fo the resource.
     */
    tagName: string;

    /**
     * Selector where the resource will be added.
     */
    target: "head" | "body";

    /**
     * A collection of attributes added to the resource.
     */
    attributes: Record<string, unknown>;
  }

  interface ResourceHandler {
    /**
     * Test assertion for using the embedded parser.
     */
    test: RegExp;

    /**
     * Function called for adding a collection of resources to the page.
     * @param request the request file
     */
    handler(request: string): ResourceDescriptor[];
  }

  interface Options {
    /**
     * A single or collection of pages to generate.
     */
    pages: PageDescriptor | PageDescriptor[] | ((entryNames: string[]) => Promise<PageDescriptor[]>);

    /**
     * A collection of custom resource handlers used for including additional tags to the page.
     */
    resourceHandlers?: ResourceHandler[];
  }
}

declare class PagePlugin {
  /**
   * Creates a new page plugin.
   * @param options the plugin options
   */
  constructor(options: PagePlugin.Options);

  /**
   * Applies the plugin to the compiler.
   * @param compiler the Webpack compiler
   */
  apply(compiler: Compiler): void;
}

export = PagePlugin;
