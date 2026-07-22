import { Validator } from '../utils/Validator.js';
/**
 * Scaffolds a complete module: model + mapper + repository + service + store.
 */
export class MakeModuleCommand {
    layer;
    name;
    generators;
    logger;
    options;
    constructor(layer, name, generators, logger, options = {}) {
        this.layer = layer;
        this.name = name;
        this.generators = generators;
        this.logger = logger;
        this.options = options;
    }
    async execute() {
        try {
            Validator.assertNonEmpty(this.layer, 'Layer');
            Validator.assertNonEmpty(this.name, 'Name');
            Validator.assertValidName(this.name);
            this.logger.title(`Creating module: ${this.name} in layer "${this.layer}"`);
            const opts = { layer: this.layer, name: this.name, force: this.options.force };
            await this.generators.model.generate(opts);
            await this.generators.mapper.generate(opts);
            await this.generators.repository.generate(opts);
            await this.generators.service.generate(opts);
            await this.generators.store.generate(opts);
            this.logger.newLine();
            this.logger.success(`Module "${this.name}" created successfully in layer "${this.layer}".`);
        }
        catch (error) {
            this.logger.error(`Failed to create module: ${error.message}`);
            process.exit(1);
        }
    }
}
//# sourceMappingURL=MakeModuleCommand.js.map