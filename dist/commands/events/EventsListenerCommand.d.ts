import type { ICommand } from '../ICommand.js';
import type { EventListenerGenerator } from '../../generators/events/EventListenerGenerator.js';
import type { LoggerService } from '../../services/LoggerService.js';
export declare class EventsListenerCommand implements ICommand {
    private readonly name;
    private readonly generator;
    private readonly logger;
    private readonly options;
    constructor(name: string, generator: EventListenerGenerator, logger: LoggerService, options?: {
        force?: boolean;
        eventName?: string;
        eventKey?: string;
        eventsRoot?: string;
        cwd?: string;
        target?: string;
        targetKind?: 'layer' | 'module';
    });
    execute(): Promise<void>;
}
//# sourceMappingURL=EventsListenerCommand.d.ts.map