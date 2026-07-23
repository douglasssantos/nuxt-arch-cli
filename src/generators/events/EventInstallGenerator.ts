import path from 'node:path'
import { FileService } from '../../services/FileService.js'
import { TemplateService } from '../../services/TemplateService.js'
import { FormatterService } from '../../services/FormatterService.js'
import { LoggerService } from '../../services/LoggerService.js'
import { FileWriter } from '../../utils/FileWriter.js'
import { PathResolver } from '../../utils/PathResolver.js'

export interface EventsInstallOptions {
  force?: boolean
  cwd?: string
  eventsRoot?: string
  /**
   * Absolute path to the layer root (e.g. /project/layers/core).
   * When provided the Nuxt plugin is placed at {layerRoot}/{app/}plugins/ instead
   * of inside the eventsRoot, so Nuxt auto-discovers it.
   */
  layerRoot?: string
}

export class EventInstallGenerator {
  constructor(
    private readonly fileService: FileService,
    private readonly templateService: TemplateService,
    private readonly formatterService: FormatterService,
    private readonly logger: LoggerService,
    private readonly pathResolver: PathResolver,
  ) {}

  async generate(options: EventsInstallOptions = {}): Promise<void> {
    const cwd = options.cwd ?? process.cwd()
    const eventsRootRel = options.eventsRoot ?? 'core/events'
    const root = path.join(cwd, eventsRootRel)

    this.logger.title('Installing Event Bus infrastructure')

    // ── Plugin placement ────────────────────────────────────────────────────
    // When inside a layer: place plugin in {layerRoot}/[app/]plugins/ so Nuxt
    // auto-discovers it (respects v4 app/ prefix via pathResolver).
    // When global: keep plugin inside eventsRoot/plugins/ and ask user to
    // register it manually in nuxt.config.ts.
    const isLayerInstall = Boolean(options.layerRoot)
    const pluginDest = isLayerInstall
      ? path.join(options.layerRoot!, this.pathResolver.appDir('plugins'), 'event-bus.ts')
      : path.join(root, 'plugins', 'event-bus.ts')

    // ── Import alias for the plugin template ────────────────────────────────
    // v4: ~/  → app/  (srcDir), so paths outside app/ need @/ (rootDir alias)
    // v3: ~/  → rootDir, so ~/eventsRoot/... works directly
    // Layer install: use relative paths from the plugin file to eventsRoot
    let eventsImportBase: string
    if (isLayerInstall) {
      // Relative from {layerRoot}/[app/]plugins/ → {layerRoot}/events/
      // v4: app/plugins/ → ../../events  (up: plugins, app)
      // v3: plugins/     → ../events     (up: plugins)
      const levelsUp = this.pathResolver.version === 'v4' ? '../..' : '..'
      eventsImportBase = `${levelsUp}/events`
    } else {
      // Global install: use Nuxt alias pointing to rootDir
      // v4: @/ → rootDir  |  v3: ~/ → rootDir (same in v3)
      const alias = this.pathResolver.version === 'v4' ? '@' : '~'
      eventsImportBase = `${alias}/${eventsRootRel}`
    }

    // Create all infrastructure directories (always inside eventsRoot)
    await FileWriter.ensureDirs([
      path.join(root, 'contracts'),
      path.join(root, 'services'),
      path.join(root, 'composables'),
      path.join(root, 'plugins'),
      path.join(root, 'events'),
      path.join(root, 'listeners'),
      path.join(root, 'registry'),
      ...(isLayerInstall ? [path.dirname(pluginDest)] : []),
    ])

    const ctx = { pascalName: '', camelName: '', kebabName: '', snakeName: '', upperName: '', eventsImportBase }

    const infraFiles: Array<{ dest: string; template: string }> = [
      { dest: path.join(root, 'contracts', 'IEventBus.ts'), template: 'events/install/contracts-event-bus' },
      { dest: path.join(root, 'contracts', 'IEventHandler.ts'), template: 'events/install/contracts-event-handler' },
      { dest: path.join(root, 'services', 'EventBus.ts'), template: 'events/install/services-event-bus' },
      { dest: path.join(root, 'composables', 'useEventBus.ts'), template: 'events/install/composables-use-event-bus' },
      { dest: path.join(root, 'plugins', 'event-bus.ts'), template: 'events/install/plugin' },
      { dest: path.join(root, 'EventMap.ts'), template: 'events/install/event-map' },
      { dest: path.join(root, 'EventRegistry.ts'), template: 'events/install/event-registry' },
      { dest: path.join(root, 'index.ts'), template: 'events/install/index' },
    ]

    // Plugin goes to the nuxt-aware location; the one inside eventsRoot/plugins/
    // acts as a plain TS file (not a Nuxt plugin) when a layer root is specified.
    const allFiles = isLayerInstall
      ? [...infraFiles, { dest: pluginDest, template: 'events/install/plugin' }]
      : infraFiles

    for (const f of allFiles) {
      const raw = await this.templateService.render(f.template, ctx)
      const formatted = await this.formatterService.formatTypeScript(raw)
      await this.fileService.safeWrite(f.dest, formatted, {
        force: options.force,
        onWrite: () => this.logger.created(f.dest),
        onSkip: () => this.logger.skipped(f.dest, 'already exists'),
      })
    }

    this.logger.newLine()
    this.logger.success(`Event Bus installed at ${eventsRootRel}/`)

    if (isLayerInstall) {
      this.logger.info(`Nuxt plugin placed at: ${path.relative(cwd, pluginDest)}`)
      this.logger.info('The plugin is auto-discovered by Nuxt from the layer — no manual registration needed.')
    } else {
      this.logger.info(`Add the plugin to nuxt.config.ts → plugins: ["./${eventsRootRel}/plugins/event-bus"]`)
    }
  }
}

