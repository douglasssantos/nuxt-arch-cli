import { EventsService } from '../../services/EventsService.js';
import type { ICommand } from '../ICommand.js';
import type { LoggerService } from '../../services/LoggerService.js';
export declare class EventsRemoveCommand implements ICommand {
    private readonly eventName;
    private readonly eventsService;
    private readonly logger;
    private readonly options;
    constructor(eventName: string, eventsService: EventsService, logger: LoggerService, options?: {
        force?: boolean;
        eventsRoot?: string;
        cwd?: string;
    });
    execute(): Promise<void>;
}
//# sourceMappingURL=EventsRemoveCommand.d.ts.map