import { defineConfig } from "tsdown";

export default defineConfig(
  {
    // Vercel serverless — single bundled file, no inter-module deps
    entry: ["src/vercel.ts"],
    format: ["cjs"],
    outExtensions: () => ({ js: ".cjs" }),
  });

  //  {
  //   // Regular Node.js server
  //   entry: ["src/**/*", "!src/**/*.test.*"],
  //   format: ["cjs"],
  //   outExtensions: () => ({ js: ".cjs" })
  // }