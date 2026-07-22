import { FileService } from '../services/FileService.js'
import { TemplateService } from '../services/TemplateService.js'
import { FormatterService } from '../services/FormatterService.js'
import { BarrelService } from '../services/BarrelService.js'
import { LoggerService } from '../services/LoggerService.js'
import { NameResolver } from '../utils/NameResolver.js'
import { PathResolver } from '../utils/PathResolver.js'

export interface GeneratorOptions {
  force?: boolean
  layer: string
  name: string
}

export abstract class BaseGenerator {
  constructor(
    protected readonly fileService: FileService,
    protected readonly templateService: TemplateService,
    protected readonly formatterService: FormatterService,
    protected readonly barrelService: BarrelService,
    protected readonly logger: LoggerService,
    protected readonly pathResolver: PathResolver,
  ) {}

  protected async generateFile(
    filePath: string,
    templateName: string,
    context: Record<string, unknown>,
    options: { force?: boolean; vue?: boolean },
  ): Promise<void> {
    const content = await this.templateService.render(templateName, {
      ...context,
      // Map ResolvedName keys (pascal/camel/…) to template keys (pascalName/camelName/…)
      pascalName: (context['pascalName'] ?? context['pascal']) as string,
      camelName: (context['camelName'] ?? context['camel']) as string,
      kebabName: (context['kebabName'] ?? context['kebab']) as string,
      snakeName: (context['snakeName'] ?? context['snake']) as string,
      upperName: (context['upperName'] ?? context['upper']) as string,
    })

    const formatted = options.vue
      ? await this.formatterService.formatVue(content)
      : await this.formatterService.formatTypeScript(content)

    await this.fileService.safeWrite(filePath, formatted, {
      force: options.force,
      onWrite: () => this.logger.created(filePath),
      onSkip: () => this.logger.skipped(filePath, 'already exists'),
    })
  }

  protected resolveNames(name: string) {
    return NameResolver.resolve(name)
  }

  abstract generate(options: GeneratorOptions): Promise<void>
}
