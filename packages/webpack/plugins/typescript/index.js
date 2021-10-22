const cf = require("@babel/code-frame");
const path = require("path");
const ts = require("typescript");

const diagnosticHost = {
  getCanonicalFileName: (fileName) => fileName,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};

class TypescriptPlugin {
  constructor(options = {}) {
    this.configFile = options.configFile || "tsconfig.json";
    this.embeddedParsers = options.embeddedParsers || [];
  }

  apply(compiler) {
    if (compiler.isChild()) {
      return;
    }

    const result = TypescriptPlugin.parseConfigFile(
      path.resolve(this.configFile)
    );

    if (result == null) {
      return;
    }

    const { fileNames, options } = result;

    options.noEmit = true;
    options.skipLibCheck = true;

    options.sourceMap = false;
    options.inlineSourceMap = false;

    options.declaration = false;
    options.declarationMap = false;

    const isNormalModule = (input) =>
      input instanceof compiler.webpack.NormalModule;

    compiler.hooks.done.tap("TypescriptPlugin", (stats) => {
      const { compilation } = stats;

      const entryFiles = new Set(
        fileNames.filter((fileName) => fileName.endsWith(".d.ts"))
      );

      const host = ts.createCompilerHost(options);

      const { fileExists, readFile } = host;

      const parseEmbeddedFileName = (fileName) => {
        const extension = path.extname(fileName);
        const embeddedFileName = fileName.slice(0, -extension.length);
        const embeddedExtension = path.extname(embeddedFileName);

        return {
          extension,
          embeddedFileName,
          embeddedExtension,
        };
      };

      const readEmbeddedFile = (fileName) => {
        const { embeddedFileName, extension } = parseEmbeddedFileName(fileName);

        if (fileExists(embeddedFileName)) {
          const embeddedSource = getEmbeddedSource(embeddedFileName);

          if (embeddedSource && embeddedSource.extension === extension) {
            return embeddedSource;
          }
        }

        return null;
      };

      const embeddedSources = new Map();

      const getEmbeddedSource = (fileName) => {
        let source = embeddedSources.get(fileName);

        if (typeof source === "undefined") {
          const parser = this.embeddedParsers.find((parser) =>
            parser.test.test(fileName)
          );

          if (parser) {
            source = parser.parse(fileName, readFile(fileName));
          }

          embeddedSources.set(fileName, source);
        }

        return source;
      };

      host.fileExists = (fileName) => {
        const embeddedFile = readEmbeddedFile(fileName);

        if (embeddedFile) {
          return true;
        }

        return fileExists(fileName);
      };

      host.readFile = (fileName) => {
        const embeddedFile = readEmbeddedFile(fileName);

        if (embeddedFile) {
          return embeddedFile.content;
        }

        return readFile(fileName);
      };

      const addEntryFile = (fileName) => {
        const embeddedSource = getEmbeddedSource(fileName);

        if (embeddedSource) {
          entryFiles.add(`${fileName}${embeddedSource.extension}`);
        }

        if (fileName.endsWith(".ts") || fileName.endsWith(".tsx")) {
          entryFiles.add(fileName);
        }
      };

      compilation.entrypoints.forEach((entrypoint) => {
        if (!entrypoint.isInitial()) {
          return;
        }

        entrypoint.chunks.forEach((chunk) => {
          const modules = compilation.chunkGraph.getChunkModules(chunk);

          modules
            .filter((module) => compilation.chunkGraph.isEntryModule(module))
            .forEach((module) => {
              if (isNormalModule(module.rootModule)) {
                module = module.rootModule;
              }

              module.dependencies.forEach((dependency) => {
                const module = compilation.moduleGraph.getModule(dependency);

                if (isNormalModule(module)) {
                  addEntryFile(module.resource);
                }
              });

              if (isNormalModule(module)) {
                addEntryFile(module.resource);
              }
            });
        });
      });

      const program = ts.createProgram({
        rootNames: Array.from(entryFiles),
        options,
        host,
      });

      const diagnostics = ts.getPreEmitDiagnostics(program);

      diagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
          const embeddedFile = readEmbeddedFile(diagnostic.file.fileName);

          if (embeddedFile) {
            diagnostic.file.fileName = embeddedFile.fileName;
          }
        }

        let message = ts.formatDiagnostic(diagnostic, diagnosticHost);

        if (diagnostic.file) {
          const start = diagnostic.file.getLineAndCharacterOfPosition(
            diagnostic.start
          );

          const end = diagnostic.file.getLineAndCharacterOfPosition(
            diagnostic.start + diagnostic.length
          );

          message += cf.codeFrameColumns(
            diagnostic.file.text,
            {
              start: {
                line: start.line + 1,
                column: start.character + 1,
              },
              end: {
                line: end.line + 1,
                column: end.character + 1,
              },
            },
            {
              highlightCode: true,
            }
          );
        }

        switch (diagnostic.category) {
          case ts.DiagnosticCategory.Error:
            return compilation.errors.push(message);

          case ts.DiagnosticCategory.Warning:
            return compilation.warnings.push(message);
        }
      });
    });
  }

  static parseConfigFile(configFile, basePath = path.dirname(configFile)) {
    const { config } = ts.readConfigFile(configFile, ts.sys.readFile);

    if (config == null) {
      return null;
    }

    return {
      ...ts.parseJsonConfigFileContent(config, ts.sys, basePath),
      basePath,
    };
  }
}

module.exports = TypescriptPlugin;
