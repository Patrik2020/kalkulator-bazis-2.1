import globals from "globals";

const correctnessRules = {
  "constructor-super": "error",
  "for-direction": "error",
  "getter-return": "error",
  "no-class-assign": "error",
  "no-constant-binary-expression": "error",
  "no-const-assign": "error",
  "no-dupe-args": "error",
  "no-dupe-else-if": "error",
  "no-dupe-keys": "error",
  "no-duplicate-case": "error",
  "no-ex-assign": "error",
  "no-func-assign": "error",
  "no-import-assign": "error",
  "no-loss-of-precision": "error",
  "no-misleading-character-class": "error",
  "no-new-native-nonconstructor": "error",
  "no-obj-calls": "error",
  "no-redeclare": "error",
  "no-regex-spaces": "error",
  "no-self-assign": "error",
  "no-setter-return": "error",
  "no-shadow-restricted-names": "error",
  "no-sparse-arrays": "error",
  "no-this-before-super": "error",
  "no-undef": "error",
  "no-unexpected-multiline": "error",
  "no-unreachable": "error",
  "no-unreachable-loop": "error",
  "no-unsafe-finally": "error",
  "no-unsafe-negation": "error",
  "no-unsafe-optional-chaining": "error",
  "no-unused-labels": "error",
  "no-with": "error",
  "require-yield": "error",
  "use-isnan": "error",
  "valid-typeof": "error",

  // Clean Code 1.1-ben még csak jelzés: előbb felmérjük és fokozatosan
  // takarítjuk a meglévő kódot, mielőtt blokkolóvá tesszük.
  "no-debugger": "warn",
  "no-unused-vars": [
    "warn",
    {
      args: "none",
      caughtErrors: "none",
      varsIgnorePattern: "^_",
    },
  ],
};

export default [
  {
    ignores: [
      "node_modules/**",
      "docs/**",
    ],
  },
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        // Több modul böngészőben fut, de CommonJS exportot is ad a Node-teszteknek.
        module: "readonly",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: correctnessRules,
  },
  {
    files: ["js/altalanos/afa.js"],
    languageOptions: {
      globals: {
        // Régi klasszikus <script> integráció: ez az oldal a utils.js globális
        // segédfüggvényeit használja. Csak itt engedjük őket explicit módon.
        format: "readonly",
        formatInputNumber: "readonly",
        parseNumber: "readonly",
        showLinks: "readonly",
      },
    },
  },
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: globals.node,
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: correctnessRules,
  },
  {
    files: ["worker/src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...(globals.worker || {}),
        ...(globals.serviceworker || {}),
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: correctnessRules,
  },
];
