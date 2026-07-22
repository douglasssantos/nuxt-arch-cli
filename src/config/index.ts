export interface EventsConfig {
  enabled: boolean
  root: string
  autoRegister: boolean
  autoBarrel: boolean
  autoSync: boolean
  generateReadme: boolean
  namespaceByLayer: boolean
}

export interface LayerDirsConfig {
  app: {
    components: string
    composables: string
    middleware: string
    pages: string
    plugins: string
  }
  application: {
    dto: string
    commands: string
    queries: string
    usecases: string
  }
  domain: {
    entities: string
    repositories: string
    services: string
    contracts: string
    valueObjects: string
  }
  infrastructure: {
    api: string
    mappers: string
    repositories: string
    stores: string
  }
  tests: string
}

export interface ModuleDirsConfig {
  models: string
  events: string
  listeners: string
  mappers: string
  repositories: string
  services: string
  composables: string
  plugins: string
  components: string
  pages: string
}

export interface CliConfig {
  /**
   * Default architecture for scaffolding commands.
   * - 'layer': DDD layers (layers/<name>/)
   * - 'module': Flat modules (modules/<name>/)
   * - 'auto': Detect from filesystem (default)
   */
  architecture: 'layer' | 'module' | 'auto'

  /** Directory where layers are stored. Default: 'layers' */
  layersDir: string

  /** Directory where flat modules are stored. Default: 'modules' */
  modulesDir: string

  /** Internal directory structure for DDD layers. */
  layerDirs: LayerDirsConfig

  /** Internal directory structure for flat modules. */
  moduleDirs: ModuleDirsConfig

  nuxtConfigFile: string
  nuxtCompatibility: 'v3' | 'v4' | 'auto'
  events: EventsConfig
}

export const defaultLayerDirs: LayerDirsConfig = {
  app: {
    components: 'app/components',
    composables: 'app/composables',
    middleware: 'app/middleware',
    pages: 'app/pages',
    plugins: 'app/plugins',
  },
  application: {
    dto: 'application/dto',
    commands: 'application/commands',
    queries: 'application/queries',
    usecases: 'application/usecases',
  },
  domain: {
    entities: 'domain/entities',
    repositories: 'domain/repositories',
    services: 'domain/services',
    contracts: 'domain/contracts',
    valueObjects: 'domain/value-objects',
  },
  infrastructure: {
    api: 'infrastructure/api',
    mappers: 'infrastructure/mappers',
    repositories: 'infrastructure/repositories',
    stores: 'infrastructure/stores',
  },
  tests: 'tests',
}

export const defaultModuleDirs: ModuleDirsConfig = {
  models: 'models',
  events: 'events',
  listeners: 'listeners',
  mappers: 'mappers',
  repositories: 'repositories',
  services: 'services',
  composables: 'composables',
  plugins: 'plugins',
  components: 'components',
  pages: 'pages',
}

export const defaultEventsConfig: EventsConfig = {
  enabled: true,
  root: 'core/events',
  autoRegister: true,
  autoBarrel: true,
  autoSync: true,
  generateReadme: false,
  namespaceByLayer: true,
}

export const defaultConfig: CliConfig = {
  architecture: 'auto',
  layersDir: 'layers',
  modulesDir: 'modules',
  layerDirs: defaultLayerDirs,
  moduleDirs: defaultModuleDirs,
  nuxtConfigFile: 'nuxt.config.ts',
  nuxtCompatibility: 'auto',
  events: defaultEventsConfig,
}

/** @deprecated Use defaultConfig.layerDirs instead */
export const LAYER_DIRS = defaultLayerDirs
