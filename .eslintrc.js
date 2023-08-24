module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        project: './tsconfig.json'
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb',
        'airbnb-typescript',
    ],
    rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/indent': ['error', 4],
        'no-plusplus': 'off',
    },
    overrides: [
        {
            files: 'src/**/test/**',
            rules: {
                'max-classes-per-file': 'off',
            }
        }
    ],
};
