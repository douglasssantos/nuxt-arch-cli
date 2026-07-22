import { pascalCase, camelCase, kebabCase, snakeCase } from 'change-case'

export class CaseConverter {
  static toPascal(value: string): string {
    return pascalCase(value)
  }

  static toCamel(value: string): string {
    return camelCase(value)
  }

  static toKebab(value: string): string {
    return kebabCase(value)
  }

  static toSnake(value: string): string {
    return snakeCase(value)
  }

  static toUpper(value: string): string {
    return snakeCase(value).toUpperCase()
  }
}
