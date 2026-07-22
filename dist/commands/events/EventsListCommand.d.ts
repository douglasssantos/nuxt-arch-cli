import type { ICommand } from '../ICommand.js';
import type { EventsService } from '../../services/EventsService.js';
import type { LoggerService } from '../../services/LoggerService.js';
export declare class EventsListCommand implements ICommand {
    private readonly eventsService;
    private readonly logger;
    private readonly options;
    constructor(eventsService: EventsService, logger: LoggerService, options?: {
        eventsRoot?: string;
        layersDir?: string;
        modulesDir?: string;
        cwd?: string;
    });
    execute(): Promise<void>;
}
//# sourceMappingURL=EventsListCommand.d.ts.map