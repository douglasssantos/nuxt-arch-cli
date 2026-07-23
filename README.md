# nuxt-arch-cli

> Professional CLI + Nuxt Module for **Nuxt 4** projects with **DDD**, **Clean Architecture**, **Nuxt Layers** and **Pinia ORM**.

Inspired by **Laravel Artisan**, **NestJS CLI** and **Angular CLI** — standardize the creation of enterprise frontend projects with a single command.

---

## Installation

```bash
npm install -D nuxt-arch-cli
# or
pnpm add -D nuxt-arch-cli
```

### Global CLI

```bash
npm install -g nuxt-arch-cli
```

---

## Nuxt Module

Add to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-arch-cli'],

  nuxtArchCli: {
    eventBus: true  // default: true — auto-registers EventBus plugin
  }
})
```

This automatically:
- Registers the **EventBus** plugin (SSR-safe, in-memory)
- Auto-imports the `useEventBus()` composable
- Adds TypeScript types for `$eventBus`

```typescript
// Any component or page — auto-imported
const bus = useEventBus()

await bus.emit('user:logged-in', { userId: 1 })
bus.on('user:logged-in', (payload) => console.log(payload))
bus.once('user:logged-in', handler)
bus.off('user:logged-in', handler)
```

---

## CLI Usage

---

## Available Aliases

After installing, the following command aliases are available:

| Alias | Usage |
|---|---|
| `nxti` | `npx nxti make:layer auth` |
| `nuxti` | `npx nuxti make:layer auth` |
| `nuxt-arch` | `npx nuxt-arch make:layer auth` |
| `nuxt-arch-cli` | `npx nuxt-arch-cli make:layer auth` |
| `nuxi-arch` | `npx nuxi-arch make:layer auth` *(integrates with `nuxi arch`)* |

All aliases point to the same CLI. Choose whichever fits your workflow.

```bash
# All equivalent:
npx nxti --help
npx nuxti --help
npx nuxt-arch --help
npx nuxt-arch-cli --help
npx nuxi-arch --help

# OR 

npm run nxti --help
npm run nuxti --help
npm run nuxt-arch --help
npm run nuxt-arch-cli --help
npm run nuxi-arch --help

```

---

### Publish Config

```bash
npx nuxti publish:config
```

Creates `nuxt-architect.config.ts` at the root of your project.

### Configuration

```typescript
// nuxt-architect.config.ts
export default {
  architecture: 'module',  // 'layer' | 'module' | 'auto'
  layersDir: 'layers',
  modulesDir: 'modules',

  layerDirs: {
    app: { 
        components: 'app/components', 
        pages: 'app/pages', 
        ... 
    },
    domain: { 
        entities: 'domain/entities', 
        contracts: 'domain/contracts', 
        ... 
    },
    application: { 
        usecases: 'application/usecases', 
        dto: 'application/dto', 
        ... 
    },
    infrastructure: { 
        api: 'infrastructure/api', 
        stores: 'infrastructure/stores', 
        ... 
    },
  },

  moduleDirs: {
    models: 'models', 
    events: 'events', 
    listeners: 'listeners',
    services: 'services', 
    repositories: 'repositories', 
    composables: 'composables',
    ...
  },

  events: {
    root: 'core/events',
    autoRegister: true,
    autoBarrel: true,
  },
}
```

---

## Commands

### Scaffolding

| Command | Description |
|---|---|
| `npx nuxti make:layer <name>` | Create layer or module (depends on `architecture` config) |
| `npx nuxti make:model <name> --layer <layer>` | Pinia ORM model (entity) |
| `npx nuxti make:mapper <name> --layer <layer>` | Data mapper (`toModel` + `toApi`) |
| `npx nuxti make:repository <name> --layer <layer>` | Repository interface + implementation |
| `npx nuxti make:service <name> --layer <layer>` | HTTP API service with error handling |
| `npx nuxti make:store <name> --layer <layer>` | Pinia store |
| `npx nuxti make:usecase <name> --layer <layer>` | Use case |
| `npx nuxti make:dto <name> --layer <layer>` | Data Transfer Object |
| `npx nuxti make:component <name> --layer <layer>` | Vue component |
| `npx nuxti make:page <name> --layer <layer>` | Nuxt page |
| `npx nuxti make:composable <name> --layer <layer>` | Vue composable |
| `npx nuxti make:plugin <name> --layer <layer>` | Nuxt plugin |
| `npx nuxti make:middleware <name> --layer <layer>` | Nuxt route middleware |
| `npx nuxti make:enum <name> --layer <layer>` | TypeScript enum |
| `npx nuxti make:interface <name> --layer <layer>` | TypeScript interface |

### Event Bus

| Command | Description |
|---|---|
| `npx nuxti events:install` | Install Event Bus infrastructure (`core/events/`) |
| `npx nuxti make:event <name> [--layer <target>]` | Create a domain event |
| `npx nuxti make:listener <name> [--layer <target>]` | Create an event listener |
| `npx nuxti events:sync` | Rebuild `EventMap` + `EventRegistry` + Barrel Files |
| `npx nuxti events:list` | List all registered events and listeners |
| `npx nuxti events:inspect <event>` | Inspect event payload and listeners |
| `npx nuxti events:doctor` | Validate consistency (orphans, duplicates) |
| `npx nuxti events:remove <name>` | Remove an event with confirmation |

---

## Architecture modes

### `architecture: "layer"` — DDD with Nuxt Layers

```bash
npx nuxti make:layer auth
```

```
layers/auth/
├── app/           (components, pages, plugins, middleware, composables)
├── application/   (usecases, dto, commands, queries)
├── domain/        (entities, repositories, services, contracts, value-objects)
├── infrastructure/(api, mappers, repositories, stores)
├── tests/
└── nuxt.config.ts
```

### `architecture: "module"` — Flat modules

```bash
npx nuxti make:layer ticket
```

```
modules/ticket/
├── models/
├── events/
├── listeners/
├── mappers/
├── repositories/
├── services/
├── composables/
├── plugins/
├── components/
├── pages/
└── index.ts
```

---

## Event Bus workflow

```bash
# 1. Install infrastructure
npx nuxti events:install

# 2. Create events co-located with the module
npx nuxti make:event UserLoggedIn --layer auth
npx nuxti make:event TicketCreated --layer ticket

# 3. Create listeners
npx nuxti make:listener SyncWallet --layer auth --event UserLoggedIn
npx nuxti make:listener NotifyAdmin --layer ticket --event TicketCreated

# 4. Sync EventMap + EventRegistry
npx nuxti events:sync

# 5. Inspect
npx nuxti events:list
npx nuxti events:inspect user-logged-in
```

---

## Global configuration (`nuxt-architect.config.json`)

For projects that prefer JSON over TypeScript config:

```json
{
  "architecture": "module",
  "layersDir": "layers",
  "modulesDir": "modules",
  "events": {
    "root": "core/events",
    "autoRegister": true,
    "autoBarrel": true
  }
}
```

---

## Options: `--force`

All `make:*` commands respect existing files. Use `--force` to overwrite:

```bash
npx nuxti make:layer auth --force
npx nuxti make:event UserLoggedIn --layer auth --force
```

---

## License

MIT © [douglasssantos](https://github.com/douglasssantos)
