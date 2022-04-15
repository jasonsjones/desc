module.exports = {
    root: true,
    extends: ['plugin:prettier/recommended'],
    plugins: ['prettier'],
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {}
    },
    env: {
        browser: true,
        node: true,
        es2020: true,
        jest: true
    },
    rules: {
        'prettier/prettier': ['warn'],
        'no-console': 'off',
        semi: 'warn'
    },
    overrides: [
        {
            files: ['**/*.ts'],
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier'
            ],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module'
            },
            env: {
                node: true,
                jest: true
            },
            rules: {
                '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
                '@typescript-eslint/explicit-function-return-type': [
                    'warn',
                    { allowExpressions: true }
                ],
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/interface-name-prefix': 'off',
                '@typescript-eslint/explicit-member-accessibility': 'off'
            }
        }
    ]
};
