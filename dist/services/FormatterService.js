import prettier from 'prettier';
export class FormatterService {
    async formatTypeScript(content) {
        try {
            return await prettier.format(content, {
                parser: 'typescript',
                semi: false,
                singleQuote: true,
                trailingComma: 'all',
                printWidth: 100,
                tabWidth: 2,
            });
        }
        catch {
            return content;
        }
    }
    async formatVue(content) {
        try {
            return await prettier.format(content, {
                parser: 'vue',
                semi: false,
                singleQuote: true,
                trailingComma: 'all',
                printWidth: 100,
                tabWidth: 2,
            });
        }
        catch {
            return content;
        }
    }
    async format(content, filePath) {
        if (filePath.endsWith('.vue')) {
            return this.formatVue(content);
        }
        return this.formatTypeScript(content);
    }
}
//# sourceMappingURL=FormatterService.js.map