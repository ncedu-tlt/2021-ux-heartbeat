module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json'
    },
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended'
    ],
    rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/generator-star-spacing': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'no-console': ['warn', {
            allow: ['warn', 'error']
        }],
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always'
        }],
        '@typescript-eslint/brace-style': ['error', '1tbs', {
            allowSingleLine: false
        }],
        'object-curly-newline': ['error', {
            consistent: true
        }],
        'quotes': ['error', 'double', {
            avoidEscape: true,
            allowTemplateLiterals: true
        }],
        'semi': 'off',
        '@typescript-eslint/semi': ['error', 'always']
    }
};
