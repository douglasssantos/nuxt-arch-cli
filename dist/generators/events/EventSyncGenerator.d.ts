import { EventsService } from '../../services/EventsService.js';
import { LoggerService } from '../../services/LoggerService.js';
export interface EventSyncOptions {
    eventsRoot?: string;
    layersDir?: string;
    modulesDir?: string;
    cwd?: string;
}
export declare class EventSyncGenerator {
    private readonly eventsService;
    private readonly logger;
    constructor(eventsService: EventsService, logger: LoggerService);
    sync(options?: EventSyncOptions): Promise<void>;
}
//# sourceMappingURL=EventSyncGenerator.d.ts.map