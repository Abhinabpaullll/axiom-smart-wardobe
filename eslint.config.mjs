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
  {
    rules: {
      // Initializing state from localStorage in useEffect is a valid pattern.
      // The rule is overly strict for one-time mount effects that read external state.
      "react-hooks/set-state-in-effect": "off",
      // Downgrade unused vars from error to warning (cosmetic, not runtime-breaking)
      "@typescript-eslint/no-unused-vars": "warn",
      // Downgrade explicit any from error to warning
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
