module.exports = {
    tabWidth: 4,
    useTabs: true,
    semi: true,
    singleQuote: true,
    trailingComma: 'none',
    htmlWhitespaceSensitivity: 'ignore',
    printWidth: 500,
    overrides: [
    {
        files: ['*.css', '*.scss', '*.sass', '*.less'],
        options: {
            useTabs: false
        }
    }
    ]
};