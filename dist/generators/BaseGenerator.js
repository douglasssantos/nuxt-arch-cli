import { NameResolver } from '../utils/NameResolver.js';
export class BaseGenerator {
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
    async generateFile(filePath, templateName, context, options) {
        const content = await this.templateService.render(templateName, {
            ...context,
            // Map ResolvedName keys (pascal/camel/…) to template keys (pascalName/camelName/…)
            pascalName: (context['pascalName'] ?? context['pascal']),
            camelName: (context['camelName'] ?? context['camel']),
            kebabName: (context['kebabName'] ?? context['kebab']),
            snakeName: (context['snakeName'] ?? context['snake']),
            upperName: (context['upperName'] ?? context['upper']),
        });
        const formatted = options.vue
            ? await this.formatterService.formatVue(content)
            : await this.formatterService.formatTypeScript(content);
        await this.fileService.safeWrite(filePath, formatted, {
            force: options.force,
            onWrite: () => this.logger.created(filePath),
            onSkip: () => this.logger.skipped(filePath, 'already exists'),
        });
    }
    resolveNames(name) {
        return NameResolver.resolve(name);
    }
}
//# sourceMappingURL=BaseGenerator.js.map