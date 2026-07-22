import path from 'node:path';
import { defaultConfig } from '../config/index.js';
export class PathResolver {
    cwd;
    layersDir;
    constructor(cwd = process.cwd(), layersDir = defaultConfig.layersDir) {
        this.cwd = cwd;
        this.layersDir = layersDir;
    }
    layerRoot(layer) {
        return path.join(this.cwd, this.layersDir, layer);
    }
    layerPath(layer, ...segments) {
        return path.join(this.layerRoot(layer), ...segments);
    }
    nuxtConfig() {
        return path.join(this.cwd, defaultConfig.nuxtConfigFile);
    }
    barrelFile(...segments) {
        return path.join(this.cwd, ...segments, 'index.ts');
    }
    relative(from, to) {
        return path.relative(from, to);
    }
    resolve(...segments) {
        return path.join(this.cwd, ...segments);
    }
}
//# sourceMappingURL=PathResolver.js.map