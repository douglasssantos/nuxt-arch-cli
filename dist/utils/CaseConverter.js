import { pascalCase, camelCase, kebabCase, snakeCase } from 'change-case';
export class CaseConverter {
    static toPascal(value) {
        return pascalCase(value);
    }
    static toCamel(value) {
        return camelCase(value);
    }
    static toKebab(value) {
        return kebabCase(value);
    }
    static toSnake(value) {
        return snakeCase(value);
    }
    static toUpper(value) {
        return snakeCase(value).toUpperCase();
    }
}
//# sourceMappingURL=CaseConverter.js.map