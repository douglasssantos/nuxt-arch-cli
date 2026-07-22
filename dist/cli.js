import { Command } from 'commander';
import chalk from 'chalk';
import { Container } from './config/Container.js';
import { MakeLayerCommand } from './commands/MakeLayerCommand.js';
import { MakeModuleCommand } from './commands/MakeModuleCommand.js';
import { MakeArtifactCommand } from './commands/MakeArtifactCommand.js';
import { EventsInstallCommand } from './commands/events/EventsInstallCommand.js';
import { EventsMakeCommand } from './commands/events/EventsMakeCommand.js';
import { EventsListenerCommand } from './commands/events/EventsListenerCommand.js';
import { EventsSyncCommand } from './commands/events/EventsSyncCommand.js';
import { EventsListCommand } from './commands/events/EventsListCommand.js';
import { EventsInspectCommand } from './commands/events/EventsInspectCommand.js';
import { EventsDoctorCommand } from './commands/events/EventsDoctorCommand.js';
import { EventsRemoveCommand } from './commands/events/EventsRemoveCommand.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync } from 'node:fs';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
const cwd = process.cwd();
const container = new Container(cwd);
export const program = new Command()
    .name('app')
    .description(chalk.cyan('Nuxt Architect CLI — Professional scaffolding for Nuxt 4 projects'))
    .version(pkg.version, '-v, --version');
// ─── make:layer ──────────────────────────────────────────────────────────────
program
    .command('make:layer <name>')
    .description('Create a new Nuxt layer with DDD structure')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (name, opts) => {
    const cmd = new MakeLayerCommand(name, container.layerGenerator, container.logger, {
        ...(opts.force !== undefined && { force: opts.force }),
        cwd,
    });
    await cmd.execute();
});
// ─── make:module ─────────────────────────────────────────────────────────────
program
    .command('make:module <nameOrLayer> [name]')
    .description('Create a flat module (make:module <name>) or DDD scaffold within a layer (make:module <layer> <name>)')
    .option('-f, --force', 'Overwrite existing files')
    .option('-d, --dir <dir>', 'Modules base directory (default: modules)', 'modules')
    .action(async (nameOrLayer, name, opts) => {
    if (name) {
        // make:module <layer> <name> → DDD scaffold within a layer
        const cmd = new MakeModuleCommand(nameOrLayer, name, {
            model: container.modelGenerator,
            mapper: container.mapperGenerator,
            repository: container.repositoryGenerator,
            service: container.serviceGenerator,
            store: container.storeGenerator,
        }, container.logger, { ...(opts.force !== undefined && { force: opts.force }) });
        await cmd.execute();
    }
    else {
        // make:module <name> → flat module in modules/<name>/
        await container.flatModuleGenerator.generate(nameOrLayer, {
            ...(opts.force !== undefined && { force: opts.force }),
            modulesDir: opts.dir,
        });
    }
});
// ─── make:model ──────────────────────────────────────────────────────────────
program
    .command('make:model <layer> <name>')
    .description('Create a Pinia ORM model (entity)')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.modelGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:mapper ─────────────────────────────────────────────────────────────
program
    .command('make:mapper <layer> <name>')
    .description('Create a data mapper')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.mapperGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:repository ─────────────────────────────────────────────────────────
program
    .command('make:repository <layer> <name>')
    .description('Create a repository interface + implementation')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.repositoryGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:service ────────────────────────────────────────────────────────────
program
    .command('make:service <layer> <name>')
    .description('Create an HTTP API service')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.serviceGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:store ──────────────────────────────────────────────────────────────
program
    .command('make:store <layer> <name>')
    .description('Create a Pinia store')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.storeGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:usecase ────────────────────────────────────────────────────────────
program
    .command('make:usecase <layer> <name>')
    .description('Create a use case')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.useCaseGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:dto ────────────────────────────────────────────────────────────────
program
    .command('make:dto <layer> <name>')
    .description('Create a Data Transfer Object')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.dtoGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:component ──────────────────────────────────────────────────────────
program
    .command('make:component <layer> <name>')
    .description('Create a Vue component')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.componentGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:page ───────────────────────────────────────────────────────────────
program
    .command('make:page <layer> <name>')
    .description('Create a Nuxt page')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.pageGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:composable ─────────────────────────────────────────────────────────
program
    .command('make:composable <layer> <name>')
    .description('Create a Vue composable')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.composableGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:plugin ─────────────────────────────────────────────────────────────
program
    .command('make:plugin <layer> <name>')
    .description('Create a Nuxt plugin')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.pluginGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:middleware ──────────────────────────────────────────────────────────
program
    .command('make:middleware <layer> <name>')
    .description('Create a Nuxt route middleware')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.middlewareGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:enum ───────────────────────────────────────────────────────────────
program
    .command('make:enum <layer> <name>')
    .description('Create a TypeScript enum')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.enumGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:interface ──────────────────────────────────────────────────────────
program
    .command('make:interface <layer> <name>')
    .description('Create a TypeScript interface')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.interfaceGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ═══════════════════════════════════════════════════════════════════════════════
// events:* — Event Bus namespace
// ═══════════════════════════════════════════════════════════════════════════════
// ─── events:install ──────────────────────────────────────────────────────────
program
    .command('events:install')
    .description('Install the Event Bus infrastructure (SimpleEventBus, plugin, composable, contracts)')
    .option('-f, --force', 'Overwrite existing files')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (opts) => {
    await new EventsInstallCommand(container.eventInstallGenerator, container.logger, {
        ...(opts.force !== undefined && { force: opts.force }),
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
// ─── events:make (alias for make:event) ───────────────────────────────
program
    .command('events:make <name>', { hidden: true })
    .description('Alias for make:event')
    .option('-f, --force', 'Overwrite existing files')
    .option('-n, --namespace <ns>', 'Event namespace prefix')
    .option('--layer <layer>', 'Layer where the event should be created')
    .option('--module <module>', 'Flat module where the event should be created')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (name, opts) => {
    const target = opts.layer ?? opts.module;
    const targetKind = opts.layer ? 'layer' : opts.module ? 'module' : undefined;
    await new EventsMakeCommand(name, container.eventMakeGenerator, container.logger, {
        ...(opts.force !== undefined && { force: opts.force }),
        namespace: opts.namespace ?? target,
        target,
        targetKind,
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
// ─── make:bus:event ──────────────────────────────────────────────────────────────
program
    .command('make:bus:event <layer> <name>')
    .description('Create a domain event by bus')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.eventGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:bus:listener ───────────────────────────────────────────────────────────
program
    .command('make:bus:listener <layer> <name>')
    .description('Create an event listener by bus')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.listenerGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:event ──────────────────────────────────────────────────────────────
program
    .command('make:event <name>')
    .description('Create a domain event\n' +
    '  make:event UserLoggedIn                    → core/events/events/\n' +
    '  make:event UserLoggedIn --layer auth        → layers/auth/domain/contracts/\n' +
    '  make:event UserLoggedIn --module ticket     → modules/ticket/events/')
    .option('-f, --force', 'Overwrite existing files')
    .option('-n, --namespace <ns>', 'Event namespace prefix')
    .option('--layer <layer>', 'Layer where the event should be created')
    .option('--module <module>', 'Flat module where the event should be created')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (name, opts) => {
    const target = opts.layer ?? opts.module;
    const targetKind = opts.layer ? 'layer' : opts.module ? 'module' : undefined;
    await new EventsMakeCommand(name, container.eventMakeGenerator, container.logger, {
        ...(opts.force !== undefined && { force: opts.force }),
        namespace: opts.namespace ?? target,
        target,
        targetKind,
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
// ─── make:ddd:listener (DDD layer listener) ─────────────────────────────────
program
    .command('make:ddd:listener <layer> <name>', { hidden: true })
    .description('Create a DDD-style listener inside a layer')
    .option('-f, --force', 'Overwrite existing files')
    .action(async (layer, name, opts) => {
    await new MakeArtifactCommand(layer, name, container.listenerGenerator, container.logger, {
        force: opts.force,
    }).execute();
});
// ─── make:listener ───────────────────────────────────────────────────────────
program
    .command('make:listener <name>')
    .description('Create an event listener.\n' +
    '  make:listener WalletRefresh                        → core/events/listeners/\n' +
    '  make:listener WalletRefresh --layer auth           → layers/auth/application/usecases/\n' +
    '  make:listener NotifyAdmin   --module payment       → modules/payment/listeners/')
    .option('-f, --force', 'Overwrite existing files')
    .option('-e, --event <event>', 'Event class name this listener handles')
    .option('--layer <layer>', 'Layer where the listener should be created')
    .option('--module <module>', 'Flat module where the listener should be created')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (name, opts) => {
    const target = opts.layer ?? opts.module;
    const targetKind = opts.layer ? 'layer' : opts.module ? 'module' : undefined;
    await new EventsListenerCommand(name, container.eventListenerGenerator, container.logger, {
        ...(opts.force !== undefined && { force: opts.force }),
        eventName: opts.event,
        target,
        targetKind,
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
// ─── events:listener (alias for make:listener) ───────────────────────────────
program
    .command('events:listener <name>', { hidden: true })
    .description('Alias for make:listener')
    .option('-f, --force', 'Overwrite existing files')
    .option('-e, --event <event>', 'Event class name this listener handles')
    .option('--layer <layer>', 'Layer where the listener should be created')
    .option('--module <module>', 'Flat module where the listener should be created')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (name, opts) => {
    const target = opts.layer ?? opts.module;
    const targetKind = opts.layer ? 'layer' : opts.module ? 'module' : undefined;
    await new EventsListenerCommand(name, container.eventListenerGenerator, container.logger, {
        ...(opts.force !== undefined && { force: opts.force }),
        eventName: opts.event,
        target,
        targetKind,
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
// ─── events:sync ─────────────────────────────────────────────────────────────
program
    .command('events:sync')
    .description('Rebuild EventMap, EventRegistry and Barrel Files')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (opts) => {
    await new EventsSyncCommand(container.eventSyncGenerator, container.logger, {
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
// ─── events:register (alias for sync) ────────────────────────────────────────
program
    .command('events:register')
    .description('Alias for events:sync — rebuilds EventRegistry')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (opts) => {
    await new EventsSyncCommand(container.eventSyncGenerator, container.logger, {
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
// ─── events:list ─────────────────────────────────────────────────────────────
program
    .command('events:list')
    .description('List all registered events and their listeners')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (opts) => {
    await new EventsListCommand(container.eventsService, container.logger, {
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
// ─── events:inspect ──────────────────────────────────────────────────────────
program
    .command('events:inspect <event>')
    .description('Inspect a specific event (payload, listeners)')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (event, opts) => {
    await new EventsInspectCommand(event, container.eventsService, container.logger, {
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
// ─── events:doctor ───────────────────────────────────────────────────────────
program
    .command('events:doctor')
    .description('Validate event consistency (orphans, duplicates, broken imports)')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (opts) => {
    await new EventsDoctorCommand(container.eventsService, container.logger, {
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
// ─── events:remove ───────────────────────────────────────────────────────────
program
    .command('events:remove <name>')
    .description('Remove an event and update EventMap, Registry and Barrel Files')
    .option('-f, --force', 'Skip confirmation prompt')
    .option('--root <path>', 'Events root directory', 'core/events')
    .action(async (name, opts) => {
    await new EventsRemoveCommand(name, container.eventsService, container.logger, {
        ...(opts.force !== undefined && { force: opts.force }),
        eventsRoot: opts.root,
        cwd,
    }).execute();
});
//# sourceMappingURL=cli.js.map