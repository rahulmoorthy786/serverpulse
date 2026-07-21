const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "**/*.bak",
    ],
  },

  js.configs.recommended,

  {
    files: [
      "src/**/*.js",
      "eslint.config.js",
      "vitest.config.js",
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",

      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },

    rules: {
      "no-console": "off",

      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  {
    files: ["tests/**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",

      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.vitest,
      },
    },
  },
];
