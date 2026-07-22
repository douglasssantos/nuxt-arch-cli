export class Validator {
  static isValidName(name: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)
  }

  static isValidLayerName(name: string): boolean {
    return /^[a-z][a-z0-9-]*$/.test(name)
  }

  static assertValidName(name: string): void {
    if (!this.isValidName(name)) {
      throw new Error(
        `Invalid name: "${name}". Names must start with a letter and contain only letters, numbers, hyphens, or underscores.`,
      )
    }
  }

  static assertValidLayerName(name: string): void {
    if (!this.isValidLayerName(name)) {
      throw new Error(
        `Invalid layer name: "${name}". Layer names must be lowercase and contain only letters, numbers, and hyphens.`,
      )
    }
  }

  static assertNonEmpty(value: string, label: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error(`${label} cannot be empty.`)
    }
  }
}
