import { Validator } from '../utils/Validator.js';
export class MakeLayerCommand {
    layerName;
    generator;
    logger;
    options;
    constructor(layerName, generator, logger, options = {}) {
        this.layerName = layerName;
        this.generator = generator;
        this.logger = logger;
        this.options = options;
    }
    async execute() {
        try {
            Validator.assertNonEmpty(this.layerName, 'Layer name');
            Validator.assertValidLayerName(this.layerName);
            await this.generator.generate(this.layerName, this.options);
        }
        catch (error) {
            this.logger.error(`Failed to create layer: ${error.message}`);
            process.exit(1);
        }
    }
}
//# sourceMappingURL=MakeLayerCommand.js.map