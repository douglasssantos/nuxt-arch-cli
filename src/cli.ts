import { Command } from 'commander'
import chalk from 'chalk'
import { Container } from './config/Container.js'
import { MakeLayerCommand } from './commands/MakeLayerCommand.js'
import { InitCommand } from './commands/InitCommand.js'
import { MakeArtifactCommand } from './commands/MakeArtifactCommand.js'
import { EventsInstallCommand } from './commands/events/EventsInstallCommand.js'
import { EventsMakeCommand } from './commands/events/EventsMakeCommand.js'
import { EventsListenerCommand } from './commands/events/EventsListenerCommand.js'
import { EventsSyncCommand } from './commands/events/EventsSyncCommand.js'
import { EventsListCommand } from './commands/events/EventsListCommand.js'
import { EventsInspectCommand } from './commands/events/EventsInspectCommand.js'
import { EventsDoctorCommand } from './commands/events/EventsDoctorCommand.js'
import { EventsRemoveCommand } from './commands/events/EventsRemoveCommand.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { readFileSync } from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgPath = path.resolve(__dirname, '..', 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version: string; description: string }

const cwd = process.cwd()
const container = new Container(cwd)

// Load user config eagerly so actions can use it synchronously via container.configService.get()
container.configService.load(cwd).catch(() => {/* use defaults */})

export const program = new Command()
  .name('nuxi arch')
  .description(chalk.cyan('Nuxt CLI — Professional scaffolding for Nuxt 4 projects'))
  .version(pkg.version, '-v, --version')

// ─── init ────────────────────────────────────────────────────────────────────
program
  .command('publish:config')
  .description('Copy nuxt-cli.config.ts to the root of your Nuxt project')
  .option('-f, --force', 'Overwrite existing config file')
  .action(async (opts: { force?: boolean }) => {
    await new InitCommand(container.fileService, container.logger, {
      ...(opts.force !== undefined && { force: opts.force }),
      cwd,
    }).execute()
  })

// ─── make:layer ──────────────────────────────────────────────────────────────
program
  .command('make:layer <name>')
  .description(
    'Create a new layer or module depending on config.architecture.\n' +
    '  architecture: "layer"  → layers/<name>/ (DDD structure)\n' +
    '  architecture: "module" → modules/<name>/ (flat structure)\n' +
    '  architecture: "auto"   → detects from filesystem (defaults to layer)',
  )
  .option('-f, --force', 'Overwrite existing files')
  .action(async (name: string, opts: { force?: boolean }) => {
    const cfg = await container.configService.load(cwd)
    const arch = cfg.architecture === 'auto' ? 'layer' : cfg.architecture

    if (arch === 'module') {
      await container.flatModuleGenerator.generate(name, {
        ...(opts.force !== undefined && { force: opts.force }),
        modulesDir: cfg.modulesDir,
        moduleDirs: cfg.moduleDirs,
      })
    } else {
      const cmd = new MakeLayerCommand(name, container.layerGenerator, container.logger, {
        ...(opts.force !== undefined && { force: opts.force }),
        layerDirs: cfg.layerDirs,
        cwd,
      })
      await cmd.execute()
    }
  })

// ─── make:model ──────────────────────────────────────────────────────────────
program
  .command('make:model <name>')
  .description('Create a Pinia ORM model (entity)')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.modelGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:mapper ─────────────────────────────────────────────────────────────
program
  .command('make:mapper <name>')
  .description('Create a data mapper')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.mapperGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:repository ─────────────────────────────────────────────────────────
program
  .command('make:repository <name>')
  .description('Create a repository interface + implementation')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.repositoryGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:service ────────────────────────────────────────────────────────────
program
  .command('make:service <name>')
  .description('Create an HTTP API service')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.serviceGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:store ──────────────────────────────────────────────────────────────
program
  .command('make:store <name>')
  .description('Create a Pinia store')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.storeGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:usecase ────────────────────────────────────────────────────────────
program
  .command('make:usecase <name>')
  .description('Create a use case')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.useCaseGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:dto ────────────────────────────────────────────────────────────────
program
  .command('make:dto <name>')
  .description('Create a Data Transfer Object')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.dtoGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:component ──────────────────────────────────────────────────────────
program
  .command('make:component <name>')
  .description('Create a Vue component')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.componentGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:page ───────────────────────────────────────────────────────────────
program
  .command('make:page <name>')
  .description('Create a Nuxt page')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.pageGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:composable ─────────────────────────────────────────────────────────
program
  .command('make:composable <name>')
  .description('Create a Vue composable')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.composableGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:plugin ─────────────────────────────────────────────────────────────
program
  .command('make:plugin <name>')
  .description('Create a Nuxt plugin')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.pluginGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:middleware ──────────────────────────────────────────────────────────
program
  .command('make:middleware <name>')
  .description('Create a Nuxt route middleware')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.middlewareGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:enum ───────────────────────────────────────────────────────────────
program
  .command('make:enum <name>')
  .description('Create a TypeScript enum')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.enumGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:interface ──────────────────────────────────────────────────────────
program
  .command('make:interface <name>')
  .description('Create a TypeScript interface')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.interfaceGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ═══════════════════════════════════════════════════════════════════════════════
// events:* — Event Bus namespace
// ═══════════════════════════════════════════════════════════════════════════════

// ─── events:install ──────────────────────────────────────────────────────────
program
  .command('events:install')
  .description('Install the Event Bus infrastructure (EventBus, plugin, composable, contracts)')
  .option('-f, --force', 'Overwrite existing files')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (opts: { force?: boolean; root: string }) => {
    await new EventsInstallCommand(container.eventInstallGenerator, container.logger, {
      ...(opts.force !== undefined && { force: opts.force }),
      eventsRoot: opts.root,
      cwd,
    }).execute()
  })

// ─── events:make (alias for make:event) ───────────────────────────────
program
  .command('events:make <name>', { hidden: true })
  .description('Alias for make:event')
  .option('-f, --force', 'Overwrite existing files')
  .option('-n, --namespace <ns>', 'Event namespace prefix')
  .option('--layer <layer>', 'Layer where the event should be created')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (name: string, opts: { force?: boolean; namespace?: string; layer?: string; root: string }) => {
    const cfg = await container.configService.load(cwd)
    const targetKind = container.configService.resolveTargetKind(undefined)
    await new EventsMakeCommand(name, container.eventMakeGenerator, container.logger, {
      ...(opts.force !== undefined && { force: opts.force }),
      namespace: opts.namespace ?? opts.layer,
      target: opts.layer,
      targetKind,
      eventsRoot: opts.root !== 'core/events' ? opts.root : cfg.events.root,
      layersDir: cfg.layersDir,
      modulesDir: cfg.modulesDir,
      cwd,
    }).execute()
  })

// ─── make:bus:event ──────────────────────────────────────────────────────────────
program
  .command('make:bus:event <name>')
  .description('Create a domain event by bus')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.eventGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })

// ─── make:bus:listener ───────────────────────────────────────────────────────────
program
  .command('make:bus:listener <name>')
  .description('Create an event listener by bus')
  .option('-f, --force', 'Overwrite existing files')
  .option('--layer <layer>', 'Target layer or module')
  .action(async (name: string, opts: { force?: boolean; layer?: string }) => {
    await new MakeArtifactCommand(opts.layer ?? '', name, container.listenerGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })


// ─── make:event ──────────────────────────────────────────────────────────────
program
  .command('make:event <name>')
  .description(
    'Create a domain event.\n' +
    '  make:event UserLoggedIn               → core/events/events/ (global)\n' +
    '  make:event UserLoggedIn --layer auth  → layers/auth/ or modules/auth/ depending on config.architecture',
  )
  .option('-f, --force', 'Overwrite existing files')
  .option('-n, --namespace <ns>', 'Event namespace prefix')
  .option('--layer <layer>', 'Layer where the event should be created')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (name: string, opts: { force?: boolean; namespace?: string; layer?: string; module?: string; root: string }) => {
    const cfg = await container.configService.load(cwd)
    const targetKind = container.configService.resolveTargetKind(undefined)
    await new EventsMakeCommand(name, container.eventMakeGenerator, container.logger, {
      ...(opts.force !== undefined && { force: opts.force }),
      namespace: opts.namespace ?? opts.layer,
      target: opts.layer,
      targetKind,
      eventsRoot: opts.root !== 'core/events' ? opts.root : cfg.events.root,
      layersDir: cfg.layersDir,
      modulesDir: cfg.modulesDir,
      cwd,
    }).execute()
  })

// ─── make:ddd:listener (DDD layer listener) ─────────────────────────────────
program
  .command('make:ddd:listener <layer> <name>', { hidden: true })
  .description('Create a DDD-style listener inside a layer')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (layer: string, name: string, opts: { force?: boolean }) => {
    await new MakeArtifactCommand(layer, name, container.listenerGenerator, container.logger, {
      force: opts.force,
    }).execute()
  })  

// ─── make:listener ───────────────────────────────────────────────────────────
program
  .command('make:listener <name>')
  .description(
    'Create an event listener.\n' +
    '  make:listener WalletRefresh               → core/events/listeners/ (global)\n' +
    '  make:listener WalletRefresh --layer auth  → layers/auth/ or modules/auth/ depending on config.architecture',
  )
  .option('-f, --force', 'Overwrite existing files')
  .option('-e, --event <event>', 'Event class name this listener handles')
  .option('--layer <layer>', 'Target name (layer or module, defined by config.architecture)')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (name: string, opts: { force?: boolean; event?: string; layer?: string; root: string }) => {
    const cfg = await container.configService.load(cwd)
    const targetKind = container.configService.resolveTargetKind(undefined)
    await new EventsListenerCommand(name, container.eventListenerGenerator, container.logger, {
      ...(opts.force !== undefined && { force: opts.force }),
      eventName: opts.event,
      target: opts.layer,
      targetKind,
      eventsRoot: opts.root !== 'core/events' ? opts.root : cfg.events.root,
      layersDir: cfg.layersDir,
      modulesDir: cfg.modulesDir,
      cwd,
    }).execute()
  })

// ─── events:listener (alias for make:listener) ───────────────────────────────
program
  .command('events:listener <name>', { hidden: true })
  .description('Alias for make:listener')
  .option('-f, --force', 'Overwrite existing files')
  .option('-e, --event <event>', 'Event class name this listener handles')
  .option('--layer <layer>', 'Layer where the listener should be created')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (name: string, opts: { force?: boolean; event?: string; layer?: string; module?: string; root: string }) => {
    const cfg = await container.configService.load(cwd)
    const targetKind = container.configService.resolveTargetKind(undefined)
    await new EventsListenerCommand(name, container.eventListenerGenerator, container.logger, {
      ...(opts.force !== undefined && { force: opts.force }),
      eventName: opts.event,
      target: opts.layer,
      targetKind,
      eventsRoot: opts.root !== 'core/events' ? opts.root : cfg.events.root,
      layersDir: cfg.layersDir,
      modulesDir: cfg.modulesDir,
      cwd,
    }).execute()
  })

// ─── events:sync ─────────────────────────────────────────────────────────────
program
  .command('events:sync')
  .description('Rebuild EventMap, EventRegistry and Barrel Files')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (opts: { root: string }) => {
    await new EventsSyncCommand(container.eventSyncGenerator, container.logger, {
      eventsRoot: opts.root,
      cwd,
    }).execute()
  })

// ─── events:register (alias for sync) ────────────────────────────────────────
program
  .command('events:register')
  .description('Alias for events:sync — rebuilds EventRegistry')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (opts: { root: string }) => {
    await new EventsSyncCommand(container.eventSyncGenerator, container.logger, {
      eventsRoot: opts.root,
      cwd,
    }).execute()
  })

// ─── events:list ─────────────────────────────────────────────────────────────
program
  .command('events:list')
  .description('List all registered events and their listeners')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (opts: { root: string }) => {
    await new EventsListCommand(container.eventsService, container.logger, {
      eventsRoot: opts.root,
      cwd,
    }).execute()
  })

// ─── events:inspect ──────────────────────────────────────────────────────────
program
  .command('events:inspect <event>')
  .description('Inspect a specific event (payload, listeners)')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (event: string, opts: { root: string }) => {
    await new EventsInspectCommand(event, container.eventsService, container.logger, {
      eventsRoot: opts.root,
      cwd,
    }).execute()
  })

// ─── events:doctor ───────────────────────────────────────────────────────────
program
  .command('events:doctor')
  .description('Validate event consistency (orphans, duplicates, broken imports)')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (opts: { root: string }) => {
    await new EventsDoctorCommand(container.eventsService, container.logger, {
      eventsRoot: opts.root,
      cwd,
    }).execute()
  })

// ─── events:remove ───────────────────────────────────────────────────────────
program
  .command('events:remove <name>')
  .description('Remove an event and update EventMap, Registry and Barrel Files')
  .option('-f, --force', 'Skip confirmation prompt')
  .option('--root <path>', 'Events root directory', 'core/events')
  .action(async (name: string, opts: { force?: boolean; root: string }) => {
    await new EventsRemoveCommand(
      name,
      container.eventsService,
      container.logger,
      {
        ...(opts.force !== undefined && { force: opts.force }),
        eventsRoot: opts.root,
        cwd,
      },
    ).execute()
  })
