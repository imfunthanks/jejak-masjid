import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // React Compiler flags these animation hook patterns (refs during render,
      // setState in effects for animation ticks) — they are intentional.
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      // Prototype pages use <img> and Array() constructor — acceptable
      "@next/next/no-img-element": "warn",
      "@typescript-eslint/no-array-constructor": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

