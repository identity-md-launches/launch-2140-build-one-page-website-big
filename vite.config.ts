import { createRequire } from "node:module";
import { resolve } from "node:path";

// Optional external toolchain keeps dependency installation outside restricted workspaces.
const dependencyRoot = process.env.BWU_DEPENDENCY_ROOT;
const dependencyRequire = dependencyRoot
  ? createRequire(resolve(dependencyRoot, "package.json"))
  : createRequire(import.meta.url);

export default {
  base: "./",
  resolve: {
    alias: [
      "react-dom/client",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react",
    ].map((name) => ({
      find: name,
      replacement: dependencyRequire.resolve(name),
    })),
    dedupe: ["react", "react-dom"],
  },
  build: { outDir: "dist", emptyOutDir: true },
};
