import { FileService } from '../../services/FileService.js';
import { TemplateService } from '../../services/TemplateService.js';
import { FormatterService } from '../../services/FormatterService.js';
import { BarrelService } from '../../services/BarrelService.js';
import { LoggerService } from '../../services/LoggerService.js';
export interface EventListenerOptions {
    force?: boolean;
    eventName?: string;
    eventKey?: string;
    eventsRoot?: string;
    cwd?: string;
    /** Layer or flat module name where the listener should be placed. */
    target?: string;
    /** Explicit kind: 'layer' or 'module'. Skips filesystem detection when set. */
    targetKind?: 'layer' | 'module';
    layersDir?: string;
    modulesDir?: string;
}
export declare class EventListenerGenerator {
    private readonly fileService;
    private readonly templateService;
    private readonly formatterService;
    private readonly barrelService;
    private readonly logger;
    constructor(fileService: FileService, templateService: TemplateService, formatterService: FormatterService, barrelService: BarrelService, logger: LoggerService);
    generate(listenerName: string, options?: EventListenerOptions): Promise<void>;
    private resolveTarget;
}
//# sourceMappingURL=EventListenerGenerator.d.ts.map