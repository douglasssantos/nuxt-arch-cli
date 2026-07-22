import path from 'node:path';
import { NameResolver } from '../utils/NameResolver.js';
import { FileWriter } from '../utils/FileWriter.js';
export class FlatModuleGenerator {
    fileService;
    templateService;
    formatterService;
    barrelService;
    logger;
    pathResolver;
    constructor(fileService, templateService, formatterService, barrelService, logger, pathResolver) {
        this.fileService = fileService;
        this.templateService = templateService;
        this.formatterService = formatterService;
        this.barrelService = barrelService;
        this.logger = logger;
        this.pathResolver = pathResolver;
    }
    async generate(name, options = {}) {
        const names = NameResolver.resolve(name);
        const modulesDir = options.modulesDir ?? 'modules';
        const moduleRoot = this.pathResolver.resolve(modulesDir, names.kebab);
        this.logger.title(`Creating module: ${names.pascal}`);
        // Create directories
        await FileWriter.ensureDirs([
            path.join(moduleRoot, 'models'),
            path.join(moduleRoot, 'events'),
            path.join(moduleRoot, 'listeners'),
            path.join(moduleRoot, 'mappers'),
            path.join(moduleRoot, 'repositories'),
            path.join(moduleRoot, 'services'),
            path.join(moduleRoot, 'composables'),
            path.join(moduleRoot, 'plugins'),
            path.join(moduleRoot, 'components'),
            path.join(moduleRoot, 'pages'),
        ]);
        const ctx = {
            pascalName: names.pascal,
            camelName: names.camel,
            kebabName: names.kebab,
            snakeName: names.snake,
            upperName: names.upper,
        };
        // Model
        await this.write(path.join(moduleRoot, 'models', `${names.pascal}.ts`), 'flat/model', ctx, options.force);
        await this.barrelService.addExport(path.join(moduleRoot, 'models', 'index.ts'), names.pascal);
        // Event (payload + eventKey)
        const eventCtx = {
            ...ctx,
            namespace: names.kebab,
            eventKey: `${names.kebab}:created`,
            layer: names.kebab,
        };
        await this.write(path.join(moduleRoot, 'events', `${names.pascal}Created.ts`), 'events/module-event', eventCtx, options.force);
        await this.barrelService.addExport(path.join(moduleRoot, 'events', 'index.ts'), `${names.pascal}Created`);
        // Listener
        const listenerCtx = {
            ...ctx,
            pascalName: `${names.pascal}CreatedListener`,
            eventPascal: `${names.pascal}Created`,
            eventKey: `${names.kebab}:created`,
            layer: names.kebab,
        };
        await this.write(path.join(moduleRoot, 'listeners', `${names.pascal}CreatedListener.ts`), 'events/module-listener', listenerCtx, options.force);
        await this.barrelService.addExport(path.join(moduleRoot, 'listeners', 'index.ts'), `${names.pascal}CreatedListener`);
        // Mapper (toModel + toApi)
        await this.write(path.join(moduleRoot, 'mappers', `${names.pascal}Mapper.ts`), 'flat/mapper', ctx, options.force);
        await this.barrelService.addExport(path.join(moduleRoot, 'mappers', 'index.ts'), `${names.pascal}Mapper`);
        // Repository — interface
        await this.write(path.join(moduleRoot, 'repositories', `I${names.pascal}Repository.ts`), 'flat/repository', ctx, options.force);
        // Repository — implementation (composable)
        await this.write(path.join(moduleRoot, 'repositories', `${names.pascal}Repository.ts`), 'flat/repository-impl', ctx, options.force);
        await this.barrelService.addExport(path.join(moduleRoot, 'repositories', 'index.ts'), `I${names.pascal}Repository`);
        await this.barrelService.addExport(path.join(moduleRoot, 'repositories', 'index.ts'), `${names.pascal}Repository`);
        // Service (API + error handling)
        await this.write(path.join(moduleRoot, 'services', `${names.pascal}Api.ts`), 'flat/service', ctx, options.force);
        await this.barrelService.addExport(path.join(moduleRoot, 'services', 'index.ts'), `${names.pascal}Api`);
        // Composable (business logic only)
        await this.write(path.join(moduleRoot, 'composables', `use${names.pascal}.ts`), 'flat/composable', ctx, options.force);
        await this.barrelService.addExport(path.join(moduleRoot, 'composables', 'index.ts'), `use${names.pascal}`);
        // Module index.ts (barrel)
        const indexContent = await this.templateService.render('flat/index', ctx);
        await this.fileService.safeWrite(path.join(moduleRoot, 'index.ts'), indexContent, {
            force: options.force,
            onWrite: () => this.logger.created(path.join(moduleRoot, 'index.ts')),
            onSkip: () => this.logger.skipped(path.join(moduleRoot, 'index.ts'), 'already exists'),
        });
        this.logger.newLine();
        this.logger.success(`Module "${names.pascal}" created at ${modulesDir}/${names.kebab}/`);
    }
    async write(filePath, template, ctx, force) {
        const raw = await this.templateService.render(template, ctx);
        const formatted = filePath.endsWith('.vue')
            ? await this.formatterService.formatVue(raw)
            : await this.formatterService.formatTypeScript(raw);
        await this.fileService.safeWrite(filePath, formatted, {
            force,
            onWrite: () => this.logger.created(filePath),
            onSkip: () => this.logger.skipped(filePath, 'already exists'),
        });
    }
}
//# sourceMappingURL=FlatModuleGenerator.js.map