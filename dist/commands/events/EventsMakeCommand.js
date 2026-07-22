import { Validator } from '../../utils/Validator.js';
export class EventsMakeCommand {
    name;
    generator;
    logger;
    options;
    constructor(name, generator, logger, options = {}) {
        this.name = name;
        this.generator = generator;
        this.logger = logger;
        this.options = options;
    }
    async execute() {
        try {
            Validator.assertNonEmpty(this.name, 'Event name');
            Validator.assertValidName(this.name);
            await this.generator.generate(this.name, this.options);
        }
        catch (error) {
            this.logger.error(`events:make failed: ${error.message}`);
            process.exit(1);
        }
    }
}
//# sourceMappingURL=EventsMakeCommand.js.map