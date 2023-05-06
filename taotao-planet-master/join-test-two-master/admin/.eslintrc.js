module.exports = {
  root: true,
  env: {
      node: true
  },
  'extends': [
      'plugin:vue/essential',
      'eslint:recommended'
  ],
  rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-undef': 'off',// 去掉严格检查
      'vue/no-unused-vars': 'off',
      'vue/require-v-for-key': 'off',
      'no-unused-vars': 'off',
      'vue/no-unused-components': 'off',
      'no-mixed-spaces-and-tabs':0
  },
  parserOptions: {
      parser: 'babel-eslint'
  }
};
