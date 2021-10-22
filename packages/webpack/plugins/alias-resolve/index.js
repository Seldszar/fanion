const path = require("path");
const util = require("util");

const matchPattern = (pattern, input) =>
  input.match(
    pattern
      .replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
      .replace(/-/g, "\\x2d")
      .replace(/\\\*/g, "(\\S*)")
  );

class AliasResolvePlugin {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || ".";
    this.paths = options.paths || {};
  }

  apply(resolver) {
    const target = resolver.ensureHook("resolve");
    const hook = resolver.getHook("described-resolve");

    const doResolve = util.promisify(resolver.doResolve.bind(resolver, target));

    hook.tapPromise("AliasResolvePlugin", async (request, resolveContext) => {
      const { request: moduleName } = request;

      if (moduleName.endsWith(".d.ts") || path.isAbsolute(moduleName)) {
        return;
      }

      for (const [prefix, prefixPaths] of Object.entries(this.paths)) {
        const matches = matchPattern(prefix, moduleName);

        if (matches == null) {
          continue;
        }

        for (const prefixPath of prefixPaths) {
          const matchedPath = prefixPath.replace("*", matches[1]);
          const candidate = path.join(this.baseUrl, matchedPath);

          try {
            const result = await doResolve(
              { ...request, request: candidate },
              `aliased with mapping '${prefix}': '${moduleName}' to '${candidate}'`,
              resolveContext
            );

            if (result) {
              return result;
            }
          } catch {} // eslint-disable-line no-empty
        }
      }
    });
  }
}

module.exports = AliasResolvePlugin;
