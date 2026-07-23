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
npx arch publish:config
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
    npx arch: { 
        components: 'npx arch/components', 
        pages: 'npx arch/pages', 
        ... 
    },
    domain: { 
        entities: 'domain/entities', 
        contracts: 'domain/contracts', 
        ... 
    },
    npx archlication: { 
        usecases: 'npx archlication/usecases', 
        dto: 'npx archlication/dto', 
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
| `npx arch make:layer <name>` | Create layer or module (depends on `architecture` config) |
| `npx arch make:model <name> --layer <layer>` | Pinia ORM model (entity) |
| `npx arch make:mnpx archer <name> --layer <layer>` | Data mnpx archer (`toModel` + `toApi`) |
| `npx arch make:repository <name> --layer <layer>` | Repository interface + implementation |
| `npx arch make:service <name> --layer <layer>` | HTTP API service with error handling |
| `npx arch make:store <name> --layer <layer>` | Pinia store |
| `npx arch make:usecase <name> --layer <layer>` | Use case |
| `npx arch make:dto <name> --layer <layer>` | Data Transfer Object |
| `npx arch make:component <name> --layer <layer>` | Vue component |
| `npx arch make:page <name> --layer <layer>` | Nuxt page |
| `npx arch make:composable <name> --layer <layer>` | Vue composable |
| `npx arch make:plugin <name> --layer <layer>` | Nuxt plugin |
| `npx arch make:middleware <name> --layer <layer>` | Nuxt route middleware |
| `npx arch make:enum <name> --layer <layer>` | TypeScript enum |
| `npx arch make:interface <name> --layer <layer>` | TypeScript interface |

### Event Bus

| Command | Description |
|---|---|
| `npx arch events:install` | Install Event Bus infrastructure (`core/events/`) |
| `npx arch make:event <name> [--layer <target>]` | Create a domain event |
| `npx arch make:listener <name> [--layer <target>]` | Create an event listener |
| `npx arch events:sync` | Rebuild `EventMap` + `EventRegistry` + Barrel Files |
| `npx arch events:list` | List all registered events and listeners |
| `npx arch events:inspect <event>` | Inspect event payload and listeners |
| `npx arch events:doctor` | Validate consistency (orphans, duplicates) |
| `npx arch events:remove <name>` | Remove an event with confirmation |

---

## Architecture modes

### `architecture: "layer"` — DDD with Nuxt Layers

```bash
npx arch make:layer auth
```

```
layers/auth/
├── npx arch/           (components, pages, plugins, middleware, composables)
├── npx archlication/   (usecases, dto, commands, queries)
├── domain/        (entities, repositories, services, contracts, value-objects)
├── infrastructure/(api, mnpx archers, repositories, stores)
├── tests/
└── nuxt.config.ts
```

### `architecture: "module"` — Flat modules

```bash
npx arch make:layer ticket
```

```
modules/ticket/
├── models/
├── events/
├── listeners/
├── mnpx archers/
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
npx arch events:install

# 2. Create events co-located with the module
npx arch make:event UserLoggedIn --layer auth
npx arch make:event TicketCreated --layer ticket

# 3. Create listeners
npx arch make:listener SyncWallet --layer auth --event UserLoggedIn
npx arch make:listener NotifyAdmin --layer ticket --event TicketCreated

# 4. Sync EventMap + EventRegistry
npx arch events:sync

# 5. Inspect
npx arch events:list
npx arch events:inspect user-logged-in
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
npx arch make:layer auth --force
npx arch make:event UserLoggedIn --layer auth --force
```

---

## License

MIT © [douglasssantos](https://github.com/douglasssantos)
