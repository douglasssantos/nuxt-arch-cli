import type { ICommand } from '../ICommand.js';
import type { EventsService } from '../../services/EventsService.js';
import type { LoggerService } from '../../services/LoggerService.js';
export declare class EventsInspectCommand implements ICommand {
    private readonly eventKey;
    private readonly eventsService;
    private readonly logger;
    private readonly options;
    constructor(eventKey: string, eventsService: EventsService, logger: LoggerService, options?: {
        eventsRoot?: string;
        layersDir?: string;
        modulesDir?: string;
        cwd?: string;
    });
    execute(): Promise<void>;
}
//# sourceMappingURL=EventsInspectCommand.d.ts.map