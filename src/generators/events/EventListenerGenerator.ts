import path from 'node:path'
import { FileService } from '../../services/FileService.js'
import { TemplateService } from '../../services/TemplateService.js'
import { FormatterService } from '../../services/FormatterService.js'
import { BarrelService } from '../../services/BarrelService.js'
import { LoggerService } from '../../services/LoggerService.js'
import { NameResolver } from '../../utils/NameResolver.js'
import { FileReader } from '../../utils/FileReader.js'

export interface EventListenerOptions {
  force?: boolean
  eventName?: string
  eventKey?: string
  eventsRoot?: string
  cwd?: string
  /** Layer or flat module name where the listener should be placed. */
  target?: string
  /** Explicit kind: 'layer' or 'module'. Skips filesystem detection when set. */
  targetKind?: 'layer' | 'module'
  layersDir?: string
  modulesDir?: string
}

type TargetKind = 'layer' | 'module' | 'global'

export class EventListenerGenerator {
  constructor(
    private readonly fileService: FileService,
    private readonly templateService: TemplateService,
    private readonly formatterService: FormatterService,
    private readonly barrelService: BarrelService,
    private readonly logger: LoggerService,
  ) {}

  async generate(listenerName: string, options: EventListenerOptions = {}): Promise<void> {
    const names = NameResolver.resolve(listenerName)
    const cwd = options.cwd ?? process.cwd()

    const className = names.pascal.endsWith('Listener') ? names.pascal : `${names.pascal}Listener`
    const eventPascal = options.eventName
      ? NameResolver.resolve(options.eventName).pascal
      : names.pascal.replace(/Listener$/, '')
    const eventKey = options.eventKey ?? NameResolver.resolve(eventPascal).kebab

    const { kind, listenersDir, targetLabel } = await this.resolveTarget(cwd, options)

    const filePath = path.join(listenersDir, `${className}.ts`)
    const barrelPath = path.join(listenersDir, 'index.ts')

    const ctx = {
      pascalName: className,
      camelName: names.camel,
      kebabName: names.kebab,
      snakeName: names.snake,
      upperName: names.upper,
      eventPascal,
      eventKey,
      layer: targetLabel,
    }

    const template = kind === 'layer' ? 'events/layer-listener'
      : kind === 'module' ? 'events/module-listener'
      : 'events/listener'

    const raw = await this.templateService.render(template, ctx)
    const formatted = await this.formatterService.formatTypeScript(raw)

    await this.fileService.safeWrite(filePath, formatted, {
      force: options.force,
      onWrite: () => this.logger.created(filePath),
      onSkip: () => this.logger.skipped(filePath, 'already exists'),
    })

    await this.barrelService.addExport(barrelPath, className)
    this.logger.updated(barrelPath)
  }

  private async resolveTarget(
    cwd: string,
    options: EventListenerOptions,
  ): Promise<{ kind: TargetKind; listenersDir: string; targetLabel: string }> {
    if (!options.target) {
      const eventsRoot = path.join(cwd, options.eventsRoot ?? 'core/events')
      return { kind: 'global', listenersDir: path.join(eventsRoot, 'listeners'), targetLabel: '' }
    }

    const target = NameResolver.resolve(options.target)
    const layerPath = path.join(cwd, options.layersDir ?? 'layers', target.kebab)
    const modulePath = path.join(cwd, options.modulesDir ?? 'modules', target.kebab)

    // Explicit kind (from config or flag) — validate existence first
    const layerExists = await FileReader.exists(layerPath)
    const moduleExists = await FileReader.exists(modulePath)

    if (options.targetKind === 'layer') {
      if (!layerExists && moduleExists) {
        throw new Error(
          `Target "${target.kebab}" exists as a module (modules/${target.kebab}) but the project is configured to use "layer" architecture.\n` +
          `Change architecture to "module" in nuxt-cli.config.json, or use a layer name.`,
        )
      }
      return { kind: 'layer', listenersDir: path.join(layerPath, 'application', 'usecases'), targetLabel: target.kebab }
    }

    if (options.targetKind === 'module') {
      if (!moduleExists && layerExists) {
        throw new Error(
          `Target "${target.kebab}" exists as a layer (layers/${target.kebab}) but the project is configured to use "module" architecture.\n` +
          `Change architecture to "layer" in nuxt-cli.config.json, or use a module name.`,
        )
      }
      return { kind: 'module', listenersDir: path.join(modulePath, 'listeners'), targetLabel: target.kebab }
    }

    // Auto-detect: disambiguate or error
    if (layerExists && !moduleExists) {
      return { kind: 'layer', listenersDir: path.join(layerPath, 'application', 'usecases'), targetLabel: target.kebab }
    }

    if (moduleExists && !layerExists) {
      return { kind: 'module', listenersDir: path.join(modulePath, 'listeners'), targetLabel: target.kebab }
    }

    if (layerExists && moduleExists) {
      throw new Error(
        `Ambiguous target "${target.kebab}": found both layers/${target.kebab} and modules/${target.kebab}.\n` +
        `Set "architecture" in nuxt-cli.config.ts to resolve this.`,
      )
    }

    return {
      kind: 'module',
      listenersDir: path.join(cwd, options.modulesDir ?? 'modules', target.kebab, 'listeners'),
      targetLabel: target.kebab,
    }
  }
}
