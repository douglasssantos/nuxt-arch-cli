import type { ICommand } from '../ICommand.js';
import type { EventInstallGenerator } from '../../generators/events/EventInstallGenerator.js';
import type { LoggerService } from '../../services/LoggerService.js';
export declare class EventsInstallCommand implements ICommand {
    private readonly generator;
    private readonly logger;
    private readonly options;
    constructor(generator: EventInstallGenerator, logger: LoggerService, options?: {
        force?: boolean;
        eventsRoot?: string;
        cwd?: string;
    });
    execute(): Promise<void>;
}
//# sourceMappingURL=EventsInstallCommand.d.ts.map