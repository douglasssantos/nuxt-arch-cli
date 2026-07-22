import { Validator } from '../utils/Validator.js';
/**
 * Generic command for all make:* commands that target a specific layer.
 * Avoids boilerplate by parameterizing the generator.
 */
export class MakeArtifactCommand {
    layer;
    name;
    generator;
    logger;
    options;
    constructor(layer, name, generator, logger, options = {}) {
        this.layer = layer;
        this.name = name;
        this.generator = generator;
        this.logger = logger;
        this.options = options;
    }
    async execute() {
        try {
            Validator.assertNonEmpty(this.layer, 'Layer name');
            Validator.assertNonEmpty(this.name, 'Name');
            Validator.assertValidName(this.name);
            await this.generator.generate({ layer: this.layer, name: this.name, ...this.options });
        }
        catch (error) {
            this.logger.error(`Failed: ${error.message}`);
            process.exit(1);
        }
    }
}
//# sourceMappingURL=MakeArtifactCommand.js.map