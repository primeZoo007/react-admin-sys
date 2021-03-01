module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  extends: ['standard', 'standard-jsx'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/prop-types': 1,
    'node/no-deprecated-api': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
  globals: {
    window: true,
    document: true,
    fetch: true,
  },
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: '16.5.2',
    },
    propWrapperFunctions: ['forbidExtraProps'],
  },
}
