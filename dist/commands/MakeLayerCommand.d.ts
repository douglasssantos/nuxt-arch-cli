import type { ICommand } from './ICommand.js';
import type { LayerGenerator } from '../generators/LayerGenerator.js';
import type { LoggerService } from '../services/LoggerService.js';
export interface MakeLayerCommandOptions {
    force?: boolean;
    cwd?: string;
}
export declare class MakeLayerCommand implements ICommand {
    private readonly layerName;
    private readonly generator;
    private readonly logger;
    private readonly options;
    constructor(layerName: string, generator: LayerGenerator, logger: LoggerService, options?: MakeLayerCommandOptions);
    execute(): Promise<void>;
}
//# sourceMappingURL=MakeLayerCommand.d.ts.map