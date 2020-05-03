module.exports = {
    semi: true,
    singleQuote: true,
    printWidth: 100,
    tabWidth: 4,
    trailingComma: 'none',
    overrides: [
        {
            files: '*.md',
            options: {
                parser: 'markdown',
                printWidth: 120
            }
        }
    ]
};
