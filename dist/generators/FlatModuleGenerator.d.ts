import { FileService } from '../services/FileService.js';
import { TemplateService } from '../services/TemplateService.js';
import { FormatterService } from '../services/FormatterService.js';
import { BarrelService } from '../services/BarrelService.js';
import { LoggerService } from '../services/LoggerService.js';
import { PathResolver } from '../utils/PathResolver.js';
export interface FlatModuleOptions {
    force?: boolean;
    modulesDir?: string;
}
export declare class FlatModuleGenerator {
    private readonly fileService;
    private readonly templateService;
    private readonly formatterService;
    private readonly barrelService;
    private readonly logger;
    private readonly pathResolver;
    constructor(fileService: FileService, templateService: TemplateService, formatterService: FormatterService, barrelService: BarrelService, logger: LoggerService, pathResolver: PathResolver);
    generate(name: string, options?: FlatModuleOptions): Promise<void>;
    private write;
}
//# sourceMappingURL=FlatModuleGenerator.d.ts.map