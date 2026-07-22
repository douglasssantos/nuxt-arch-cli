import { FileService } from '../../services/FileService.js';
import { TemplateService } from '../../services/TemplateService.js';
import { FormatterService } from '../../services/FormatterService.js';
import { LoggerService } from '../../services/LoggerService.js';
export interface EventsInstallOptions {
    force?: boolean;
    cwd?: string;
    eventsRoot?: string;
}
export declare class EventInstallGenerator {
    private readonly fileService;
    private readonly templateService;
    private readonly formatterService;
    private readonly logger;
    constructor(fileService: FileService, templateService: TemplateService, formatterService: FormatterService, logger: LoggerService);
    generate(options?: EventsInstallOptions): Promise<void>;
}
//# sourceMappingURL=EventInstallGenerator.d.ts.map