module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-native", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "prettier/prettier": [
      "warn",
      {
        singleQuote: false,
        trailingComma: "es5",
        printWidth: 100,
        tabWidth: 2,
        semi: true,
        bracketSpacing: true,
        arrowParens: "avoid",
      },
    ],
    quotes: ["warn", "double", { avoidEscape: true }],
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
    "react-native/no-inline-styles": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
  env: {
    "react-native/react-native": true,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
};
