
/** @type {import("eslint").Linter.Config} */
export default [
    js.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    {
        plugins: {
            onlyWarn,
        },
    },
    {
        ignores: ["dist/**", ".next/**", "**/.turbo/**", "**/coverage/**"],
    },
]
