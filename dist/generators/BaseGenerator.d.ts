import { FileService } from '../services/FileService.js';
import { TemplateService } from '../services/TemplateService.js';
import { FormatterService } from '../services/FormatterService.js';
import { BarrelService } from '../services/BarrelService.js';
import { LoggerService } from '../services/LoggerService.js';
import { PathResolver } from '../utils/PathResolver.js';
export interface GeneratorOptions {
    force?: boolean;
    layer: string;
    name: string;
}
export declare abstract class BaseGenerator {
    protected readonly fileService: FileService;
    protected readonly templateService: TemplateService;
    protected readonly formatterService: FormatterService;
    protected readonly barrelService: BarrelService;
    protected readonly logger: LoggerService;
    protected readonly pathResolver: PathResolver;
    constructor(fileService: FileService, templateService: TemplateService, formatterService: FormatterService, barrelService: BarrelService, logger: LoggerService, pathResolver: PathResolver);
    protected generateFile(filePath: string, templateName: string, context: Record<string, unknown>, options: {
        force?: boolean;
        vue?: boolean;
    }): Promise<void>;
    protected resolveNames(name: string): import("../utils/NameResolver.js").ResolvedName;
    abstract generate(options: GeneratorOptions): Promise<void>;
}
//# sourceMappingURL=BaseGenerator.d.ts.map