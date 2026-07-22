import type { ICommand } from '../ICommand.js';
import type { EventSyncGenerator } from '../../generators/events/EventSyncGenerator.js';
import type { LoggerService } from '../../services/LoggerService.js';
export declare class EventsSyncCommand implements ICommand {
    private readonly generator;
    private readonly logger;
    private readonly options;
    constructor(generator: EventSyncGenerator, logger: LoggerService, options?: {
        eventsRoot?: string;
        cwd?: string;
    });
    execute(): Promise<void>;
}
//# sourceMappingURL=EventsSyncCommand.d.ts.map