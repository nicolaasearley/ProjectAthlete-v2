import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom rules for this project
  {
    rules: {
      // Downgrade to warning - many any types are needed for Supabase type workarounds
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow refs in cloneElement for asChild pattern (common in Radix/shadcn)
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
