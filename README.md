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

### Publish Config

```bash
app publish:config
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
| `app make:layer <name>` | Create layer or module (depends on `architecture` config) |
| `app make:model <name> --layer <layer>` | Pinia ORM model (entity) |
| `app make:mapper <name> --layer <layer>` | Data mapper (`toModel` + `toApi`) |
| `app make:repository <name> --layer <layer>` | Repository interface + implementation |
| `app make:service <name> --layer <layer>` | HTTP API service with error handling |
| `app make:store <name> --layer <layer>` | Pinia store |
| `app make:usecase <name> --layer <layer>` | Use case |
| `app make:dto <name> --layer <layer>` | Data Transfer Object |
| `app make:component <name> --layer <layer>` | Vue component |
| `app make:page <name> --layer <layer>` | Nuxt page |
| `app make:composable <name> --layer <layer>` | Vue composable |
| `app make:plugin <name> --layer <layer>` | Nuxt plugin |
| `app make:middleware <name> --layer <layer>` | Nuxt route middleware |
| `app make:enum <name> --layer <layer>` | TypeScript enum |
| `app make:interface <name> --layer <layer>` | TypeScript interface |

### Event Bus

| Command | Description |
|---|---|
| `app events:install` | Install Event Bus infrastructure (`core/events/`) |
| `app make:event <name> [--layer <target>]` | Create a domain event |
| `app make:listener <name> [--layer <target>]` | Create an event listener |
| `app events:sync` | Rebuild `EventMap` + `EventRegistry` + Barrel Files |
| `app events:list` | List all registered events and listeners |
| `app events:inspect <event>` | Inspect event payload and listeners |
| `app events:doctor` | Validate consistency (orphans, duplicates) |
| `app events:remove <name>` | Remove an event with confirmation |

---

## Architecture modes

### `architecture: "layer"` — DDD with Nuxt Layers

```bash
app make:layer auth
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
app make:layer ticket
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
app events:install

# 2. Create events co-located with the module
app make:event UserLoggedIn --layer auth
app make:event TicketCreated --layer ticket

# 3. Create listeners
app make:listener SyncWallet --layer auth --event UserLoggedIn
app make:listener NotifyAdmin --layer ticket --event TicketCreated

# 4. Sync EventMap + EventRegistry
app events:sync

# 5. Inspect
app events:list
app events:inspect user-logged-in
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
app make:layer auth --force
app make:event UserLoggedIn --layer auth --force
```

---

## License

MIT © [douglasssantos](https://github.com/douglasssantos)
