import { createRequire } from "node:module";
import { resolve } from "node:path";

const requireDependency = createRequire(
  process.env.BWU_DEPENDENCY_ROOT
    ? resolve(process.env.BWU_DEPENDENCY_ROOT, "package.json")
    : import.meta.url,
);

export function dependency(name) {
  return requireDependency(name);
}
