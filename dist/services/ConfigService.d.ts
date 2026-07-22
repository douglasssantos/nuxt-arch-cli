import { type CliConfig } from '../config/index.js';
export declare class ConfigService {
    private config;
    private loaded;
    load(cwd?: string): Promise<CliConfig>;
    get(): CliConfig;
}
//# sourceMappingURL=ConfigService.d.ts.map