import path from 'node:path';
import { NameResolver } from '../utils/NameResolver.js';
import { FileWriter } from '../utils/FileWriter.js';
import { LAYER_DIRS } from '../config/index.js';
export class LayerGenerator {
    fileService;
    templateService;
    formatterService;
    nuxtConfigService;
    logger;
    pathResolver;
    constructor(fileService, templateService, formatterService, nuxtConfigService, logger, pathResolver) {
        this.fileService = fileService;
        this.templateService = templateService;
        this.formatterService = formatterService;
        this.nuxtConfigService = nuxtConfigService;
        this.logger = logger;
        this.pathResolver = pathResolver;
    }
    async generate(layerName, options = {}) {
        const name = NameResolver.resolve(layerName);
        const layerRoot = this.pathResolver.layerRoot(name.kebab);
        const cwd = options.cwd ?? process.cwd();
        this.logger.title(`Creating layer: ${name.kebab}`);
        // Create all directories
        const dirs = this.buildDirList(layerRoot);
        await FileWriter.ensureDirs(dirs);
        // Generate nuxt.config.ts for the layer
        await this.generateLayerConfig(layerRoot, name.pascal, options.force);
        // Generate index.ts for the layer
        await this.generateLayerIndex(layerRoot, name.pascal, options.force);
        // Update root nuxt.config.ts
        await this.updateRootConfig(cwd, name.kebab);
        this.logger.newLine();
        this.logger.success(`Layer "${name.kebab}" created successfully.`);
    }
    buildDirList(layerRoot) {
        return [
            path.join(layerRoot, LAYER_DIRS.app.components),
            path.join(layerRoot, LAYER_DIRS.app.composables),
            path.join(layerRoot, LAYER_DIRS.app.middleware),
            path.join(layerRoot, LAYER_DIRS.app.pages),
            path.join(layerRoot, LAYER_DIRS.app.plugins),
            path.join(layerRoot, LAYER_DIRS.application.dto),
            path.join(layerRoot, LAYER_DIRS.application.commands),
            path.join(layerRoot, LAYER_DIRS.application.queries),
            path.join(layerRoot, LAYER_DIRS.application.usecases),
            path.join(layerRoot, LAYER_DIRS.domain.entities),
            path.join(layerRoot, LAYER_DIRS.domain.repositories),
            path.join(layerRoot, LAYER_DIRS.domain.services),
            path.join(layerRoot, LAYER_DIRS.domain.contracts),
            path.join(layerRoot, LAYER_DIRS.domain.valueObjects),
            path.join(layerRoot, LAYER_DIRS.infrastructure.api),
            path.join(layerRoot, LAYER_DIRS.infrastructure.mappers),
            path.join(layerRoot, LAYER_DIRS.infrastructure.repositories),
            path.join(layerRoot, LAYER_DIRS.infrastructure.stores),
            path.join(layerRoot, LAYER_DIRS.tests),
        ];
    }
    async generateLayerConfig(layerRoot, pascalName, force) {
        const filePath = path.join(layerRoot, 'nuxt.config.ts');
        const resolved = NameResolver.resolve(pascalName);
        const content = await this.templateService.render('layer/nuxt.config', {
            pascalName: resolved.pascal,
            camelName: resolved.camel,
            kebabName: resolved.kebab,
            snakeName: resolved.snake,
            upperName: resolved.upper,
        });
        const formatted = await this.formatterService.formatTypeScript(content);
        await this.fileService.safeWrite(filePath, formatted, {
            force,
            onWrite: () => this.logger.created(filePath),
            onSkip: () => this.logger.skipped(filePath, 'already exists'),
        });
    }
    async generateLayerIndex(layerRoot, pascalName, force) {
        const filePath = path.join(layerRoot, 'index.ts');
        const resolved = NameResolver.resolve(pascalName);
        const content = await this.templateService.render('layer/index', {
            pascalName: resolved.pascal,
            camelName: resolved.camel,
            kebabName: resolved.kebab,
            snakeName: resolved.snake,
            upperName: resolved.upper,
        });
        await this.fileService.safeWrite(filePath, content, {
            force,
            onWrite: () => this.logger.created(filePath),
            onSkip: () => this.logger.skipped(filePath, 'already exists'),
        });
    }
    async updateRootConfig(_cwd, layerName) {
        const nuxtConfigPath = this.pathResolver.nuxtConfig();
        const layerPath = `./layers/${layerName}`;
        try {
            const added = await this.nuxtConfigService.addLayer(nuxtConfigPath, layerPath);
            if (added) {
                this.logger.updated(nuxtConfigPath);
            }
            else {
                this.logger.skipped(nuxtConfigPath, 'layer already registered');
            }
        }
        catch (error) {
            this.logger.warn(`Could not update nuxt.config.ts automatically: ${error.message}`);
        }
    }
}
//# sourceMappingURL=LayerGenerator.js.map