import type { ICommand } from './ICommand.js';
import type { ModelGenerator } from '../generators/ModelGenerator.js';
import type { MapperGenerator } from '../generators/MapperGenerator.js';
import type { RepositoryGenerator } from '../generators/RepositoryGenerator.js';
import type { ServiceGenerator } from '../generators/ServiceGenerator.js';
import type { StoreGenerator } from '../generators/StoreGenerator.js';
import type { LoggerService } from '../services/LoggerService.js';
export interface MakeModuleCommandOptions {
    force?: boolean;
    cwd?: string;
}
/**
 * Scaffolds a complete module: model + mapper + repository + service + store.
 */
export declare class MakeModuleCommand implements ICommand {
    private readonly layer;
    private readonly name;
    private readonly generators;
    private readonly logger;
    private readonly options;
    constructor(layer: string, name: string, generators: {
        model: ModelGenerator;
        mapper: MapperGenerator;
        repository: RepositoryGenerator;
        service: ServiceGenerator;
        store: StoreGenerator;
    }, logger: LoggerService, options?: MakeModuleCommandOptions);
    execute(): Promise<void>;
}
//# sourceMappingURL=MakeModuleCommand.d.ts.map