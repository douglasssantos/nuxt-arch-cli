import { FileService } from '../services/FileService.js';
import { TemplateService } from '../services/TemplateService.js';
import { FormatterService } from '../services/FormatterService.js';
import { NuxtConfigService } from '../services/NuxtConfigService.js';
import { LoggerService } from '../services/LoggerService.js';
import { PathResolver } from '../utils/PathResolver.js';
export interface LayerGeneratorOptions {
    force?: boolean;
    cwd?: string;
}
export declare class LayerGenerator {
    private readonly fileService;
    private readonly templateService;
    private readonly formatterService;
    private readonly nuxtConfigService;
    private readonly logger;
    private readonly pathResolver;
    constructor(fileService: FileService, templateService: TemplateService, formatterService: FormatterService, nuxtConfigService: NuxtConfigService, logger: LoggerService, pathResolver: PathResolver);
    generate(layerName: string, options?: LayerGeneratorOptions): Promise<void>;
    private buildDirList;
    private generateLayerConfig;
    private generateLayerIndex;
    private updateRootConfig;
}
//# sourceMappingURL=LayerGenerator.d.ts.map