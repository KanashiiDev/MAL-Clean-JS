import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        $: "readonly",
        jQuery: "readonly",
        tinycolor: "readonly",
        ColorThief: "readonly",
        sceditor: "readonly",
        DOMPurify: "readonly",
        LZString: "readonly",
        localforage: "readonly",
        showdown: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-await-in-loop": "off",
      "no-useless-escape": "off",
      "array-callback-return": "warn",
      "no-constructor-return": "warn",
      "no-promise-executor-return": "warn",
      "no-self-compare": "warn",
      "no-template-curly-in-string": "warn",
      "no-unmodified-loop-condition": "warn",
      "no-unreachable-loop": "warn",
      "no-use-before-define": ["error", { functions: false }],
      "no-caller": "warn",
      "no-eval": "warn",
      "no-implied-eval": "warn",
      "no-extend-native": "warn",
      "no-extra-bind": "warn",
    },
  },
];
