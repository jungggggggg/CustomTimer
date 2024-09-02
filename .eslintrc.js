module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        useTabs: false,
        singleQuote: true, // 따옴표를 싱글 쿼트로 설정
        trailingComma: 'all', // 마지막 콤마 허용
        printWidth: 80, // 최대 줄 길이 80
      },
    ],
  },
};
