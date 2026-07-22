import { CaseConverter } from './CaseConverter.js'

export interface ResolvedName {
  pascal: string
  camel: string
  kebab: string
  snake: string
  upper: string
  raw: string
}

export class NameResolver {
  static resolve(name: string): ResolvedName {
    return {
      pascal: CaseConverter.toPascal(name),
      camel: CaseConverter.toCamel(name),
      kebab: CaseConverter.toKebab(name),
      snake: CaseConverter.toSnake(name),
      upper: CaseConverter.toUpper(name),
      raw: name,
    }
  }
}
