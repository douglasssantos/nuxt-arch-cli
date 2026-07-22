import { CaseConverter } from './CaseConverter.js';
export class NameResolver {
    static resolve(name) {
        return {
            pascal: CaseConverter.toPascal(name),
            camel: CaseConverter.toCamel(name),
            kebab: CaseConverter.toKebab(name),
            snake: CaseConverter.toSnake(name),
            upper: CaseConverter.toUpper(name),
            raw: name,
        };
    }
}
//# sourceMappingURL=NameResolver.js.map