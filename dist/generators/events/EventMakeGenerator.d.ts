import { FileService } from '../../services/FileService.js';
import { TemplateService } from '../../services/TemplateService.js';
import { FormatterService } from '../../services/FormatterService.js';
import { BarrelService } from '../../services/BarrelService.js';
import { EventsService } from '../../services/EventsService.js';
import { LoggerService } from '../../services/LoggerService.js';
export interface EventMakeOptions {
    force?: boolean;
    namespace?: string;
    eventsRoot?: string;
    cwd?: string;
    /** Layer name (e.g. 'auth') or flat module name (e.g. 'ticket'). When set, the event is co-located inside the module/layer. */
    target?: string;
    /** Explicit kind: 'layer' or 'module'. Skips filesystem detection when set. */
    targetKind?: 'layer' | 'module';
    layersDir?: string;
    modulesDir?: string;
}
export declare class EventMakeGenerator {
    private readonly fileService;
    private readonly templateService;
    private readonly formatterService;
    private readonly barrelService;
    private readonly eventsService;
    private readonly logger;
    constructor(fileService: FileService, templateService: TemplateService, formatterService: FormatterService, barrelService: BarrelService, eventsService: EventsService, logger: LoggerService);
    generate(eventName: string, options?: EventMakeOptions): Promise<void>;
    private resolveTarget;
}
//# sourceMappingURL=EventMakeGenerator.d.ts.map