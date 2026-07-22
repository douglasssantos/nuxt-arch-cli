import path from 'node:path'
import { FileService } from '../../services/FileService.js'
import { TemplateService } from '../../services/TemplateService.js'
import { FormatterService } from '../../services/FormatterService.js'
import { BarrelService } from '../../services/BarrelService.js'
import { EventsService } from '../../services/EventsService.js'
import { LoggerService } from '../../services/LoggerService.js'
import { NameResolver } from '../../utils/NameResolver.js'
import { FileReader } from '../../utils/FileReader.js'

export interface EventMakeOptions {
  force?: boolean
  namespace?: string
  eventsRoot?: string
  cwd?: string
  /** Layer name (e.g. 'auth') or flat module name (e.g. 'ticket'). When set, the event is co-located inside the module/layer. */
  target?: string
  /** Explicit kind: 'layer' or 'module'. Skips filesystem detection when set. */
  targetKind?: 'layer' | 'module'
  layersDir?: string
  modulesDir?: string
}

type TargetKind = 'layer' | 'module' | 'global'

export class EventMakeGenerator {
  constructor(
    private readonly fileService: FileService,
    private readonly templateService: TemplateService,
    private readonly formatterService: FormatterService,
    private readonly barrelService: BarrelService,
    private readonly eventsService: EventsService,
    private readonly logger: LoggerService,
  ) {}

  async generate(eventName: string, options: EventMakeOptions = {}): Promise<void> {
    const names = NameResolver.resolve(eventName)
    const cwd = options.cwd ?? process.cwd()

    const { kind, eventsDir, targetLabel } = await this.resolveTarget(cwd, options)
    const namespace = options.namespace ?? options.target ?? ''
    const eventKey = namespace ? `${namespace}:${names.kebab}` : names.kebab

    const filePath = path.join(eventsDir, `${names.pascal}.ts`)
    const barrelPath = path.join(eventsDir, 'index.ts')

    const ctx = {
      pascalName: names.pascal,
      camelName: names.camel,
      kebabName: names.kebab,
      snakeName: names.snake,
      upperName: names.upper,
      namespace,
      eventKey,
      layer: targetLabel,
    }

    const template = kind === 'layer' ? 'events/layer-event'
      : kind === 'module' ? 'events/module-event'
      : 'events/event'

    const raw = await this.templateService.render(template, ctx)
    const formatted = await this.formatterService.formatTypeScript(raw)

    await this.fileService.safeWrite(filePath, formatted, {
      force: options.force,
      onWrite: () => this.logger.created(filePath),
      onSkip: () => this.logger.skipped(filePath, 'already exists'),
    })

    await this.barrelService.addExport(barrelPath, names.pascal)
    this.logger.updated(barrelPath)

    // Update global EventMap if core/events exists
    const globalEventsRoot = path.join(cwd, options.eventsRoot ?? 'core/events')
    const eventMapPath = path.join(globalEventsRoot, 'EventMap.ts')
    if (await FileReader.exists(eventMapPath)) {
      const allEvents = await this.eventsService.scanEventsAll(cwd, {
        layersDir: options.layersDir ?? 'layers',
        modulesDir: options.modulesDir ?? 'modules',
        eventsRoot: options.eventsRoot ?? 'core/events',
      })
      await this.eventsService.updateEventMap(eventMapPath, allEvents)
      this.logger.updated(eventMapPath)
    }
  }

  private async resolveTarget(
    cwd: string,
    options: EventMakeOptions,
  ): Promise<{ kind: TargetKind; eventsDir: string; targetLabel: string }> {
    if (!options.target) {
      const eventsRoot = path.join(cwd, options.eventsRoot ?? 'core/events')
      return { kind: 'global', eventsDir: path.join(eventsRoot, 'events'), targetLabel: '' }
    }

    const target = NameResolver.resolve(options.target)
    const layerPath = path.join(cwd, options.layersDir ?? 'layers', target.kebab)
    const modulePath = path.join(cwd, options.modulesDir ?? 'modules', target.kebab)

    // Explicit kind overrides filesystem detection
    if (options.targetKind === 'layer') {
      return {
        kind: 'layer',
        eventsDir: path.join(layerPath, 'domain', 'contracts'),
        targetLabel: target.kebab,
      }
    }

    if (options.targetKind === 'module') {
      return {
        kind: 'module',
        eventsDir: path.join(modulePath, 'events'),
        targetLabel: target.kebab,
      }
    }

    // Auto-detect
    if (await FileReader.exists(layerPath)) {
      return {
        kind: 'layer',
        eventsDir: path.join(layerPath, 'domain', 'contracts'),
        targetLabel: target.kebab,
      }
    }

    if (await FileReader.exists(modulePath)) {
      return {
        kind: 'module',
        eventsDir: path.join(modulePath, 'events'),
        targetLabel: target.kebab,
      }
    }

    return {
      kind: 'module',
      eventsDir: path.join(cwd, options.modulesDir ?? 'modules', target.kebab, 'events'),
      targetLabel: target.kebab,
    }
  }
}
