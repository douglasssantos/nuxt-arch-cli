import { FileReader } from '../utils/FileReader.js';
import { defaultConfig } from '../config/index.js';
import path from 'node:path';
export class ConfigService {
    config = { ...defaultConfig };
    loaded = false;
    async load(cwd = process.cwd()) {
        if (this.loaded)
            return this.config;
        const configPath = path.join(cwd, 'nuxt-architect.config.ts');
        const exists = await FileReader.exists(configPath);
        if (exists) {
            try {
                // Dynamic import for user config (ESM)
                const userConfig = (await import(configPath));
                if (userConfig.default) {
                    this.config = { ...defaultConfig, ...userConfig.default };
                }
            }
            catch {
                // Use defaults silently if config cannot be loaded
            }
        }
        this.loaded = true;
        return this.config;
    }
    get() {
        return this.config;
    }
}
//# sourceMappingURL=ConfigService.js.map