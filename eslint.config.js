// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const reactNative = require('eslint-plugin-react-native');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      'jsx-a11y': jsxA11y,
      'react-native': reactNative,
    },
    rules: {
      'jsx-a11y/accessible-emoji': 'off',
      // Disabled: false-positives with the makeStyles(colors) factory pattern
      // used across the project (StyleSheet.create returned from a function).
      'react-native/no-unused-styles': 'off',
      'react-native/no-inline-styles': 'off',
      'react-native/no-raw-text': 'off',
      'react-native/split-platform-components': 'off',
    },
  },
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'docs/*'],
  },
]);
