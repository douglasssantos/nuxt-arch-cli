export class Validator {
    static isValidName(name) {
        return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name);
    }
    static isValidLayerName(name) {
        return /^[a-z][a-z0-9-]*$/.test(name);
    }
    static assertValidName(name) {
        if (!this.isValidName(name)) {
            throw new Error(`Invalid name: "${name}". Names must start with a letter and contain only letters, numbers, hyphens, or underscores.`);
        }
    }
    static assertValidLayerName(name) {
        if (!this.isValidLayerName(name)) {
            throw new Error(`Invalid layer name: "${name}". Layer names must be lowercase and contain only letters, numbers, and hyphens.`);
        }
    }
    static assertNonEmpty(value, label) {
        if (!value || value.trim().length === 0) {
            throw new Error(`${label} cannot be empty.`);
        }
    }
}
//# sourceMappingURL=Validator.js.map