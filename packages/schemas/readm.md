  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./*": {
      "import": "./dist/*.js",
      "require": "./dist/*.cjs",
      "types": "./dist/*.d.ts"
    }
  }