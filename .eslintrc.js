module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/strongly-recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: [
    "vue"
  ],
  rules: {
    indent: [
      "warn",
      2
    ],
    quotes: [
      "warn",
      "double"
    ],
    semi: [
      "warn",
      "always"
    ],
    "padding-line-between-statements": [
      "warn",
      { blankLine: "never", prev: "*", next: "*" },
      { blankLine: "always", prev: "*", next: "export" },
      { blankLine: "always", prev: "*", next: "cjs-export" }
    ],
    "key-spacing": [
      "warn"
    ],
    "comma-dangle": [
      "warn",
      "never"
    ],
    "space-infix-ops": [
      "warn",
      { int32Hint: true }
    ],
    "space-before-function-paren": [
      "warn",
      "never"
    ],
    "comma-spacing": [
      "warn",
      { before: false, after: true }
    ],
    "object-curly-spacing": [
      "warn",
      "always"
    ],
    "vue/valid-v-slot": [
      "error",
      { allowModifiers: true }
    ],
    "vue/max-attributes-per-line": ["error", {
      singleline: {
        max: 3
      },
      multiline: {
        max: 1
      }
    }]
  }
};
