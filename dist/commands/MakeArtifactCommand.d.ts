import type { ICommand } from './ICommand.js';
import type { BaseGenerator, GeneratorOptions } from '../generators/BaseGenerator.js';
import type { LoggerService } from '../services/LoggerService.js';
/**
 * Generic command for all make:* commands that target a specific layer.
 * Avoids boilerplate by parameterizing the generator.
 */
export declare class MakeArtifactCommand implements ICommand {
    private readonly layer;
    private readonly name;
    private readonly generator;
    private readonly logger;
    private readonly options;
    constructor(layer: string, name: string, generator: BaseGenerator, logger: LoggerService, options?: Omit<GeneratorOptions, 'layer' | 'name'>);
    execute(): Promise<void>;
}
//# sourceMappingURL=MakeArtifactCommand.d.ts.map