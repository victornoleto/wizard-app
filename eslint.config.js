// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = tseslint.config(
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsRecommended,
            prettierConfig,
        ],
        plugins: {
            prettier: prettierPlugin,
        },
        processor: angular.processInlineTemplates,
        rules: {
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",
                    prefix: "app",
                    style: "camelCase",
                },
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",
                    prefix: "app",
                    style: "kebab-case",
                },
            ],
            "prettier/prettier": "error", // Enforce Prettier formatting as lint errors
            "@typescript-eslint/no-explicit-any": "warn", // Forbid usage of 'any'
            "@angular-eslint/no-input-rename": "off", // Allow renaming inputs,
            "@angular-eslint/no-output-native": "off", // Allow using native outputs (e.g., 'click'),
        },
    },
    {
        files: ["**/*.html"],
        extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility,
        ],
        rules: {
            "@angular-eslint/template/click-events-have-key-events": "off",
            "@angular-eslint/template/interactive-supports-focus": "off",
        },
    },
);
