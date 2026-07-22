import type { ICommand } from '../ICommand.js';
import type { EventMakeGenerator } from '../../generators/events/EventMakeGenerator.js';
import type { LoggerService } from '../../services/LoggerService.js';
export declare class EventsMakeCommand implements ICommand {
    private readonly name;
    private readonly generator;
    private readonly logger;
    private readonly options;
    constructor(name: string, generator: EventMakeGenerator, logger: LoggerService, options?: {
        force?: boolean;
        namespace?: string;
        eventsRoot?: string;
        cwd?: string;
        target?: string;
        targetKind?: 'layer' | 'module';
    });
    execute(): Promise<void>;
}
//# sourceMappingURL=EventsMakeCommand.d.ts.map