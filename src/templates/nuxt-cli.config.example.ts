// nuxt-cli.config.ts
// Configuração global do Nuxt CLI.
// Coloque este arquivo na raiz do seu projeto Nuxt.
// Todos os campos são opcionais — valores não definidos usam o padrão do CLI.

export default {
  /**
   * Arquitetura padrão para os comandos de scaffolding.
   * - 'layer'  → cria dentro de layers/<name>/ (DDD com Nuxt Layers)
   * - 'module' → cria dentro de modules/<name>/ (arquitetura flat com Nuxt Layers)
   * - 'auto'   → detecta automaticamente pelo sistema de arquivos (padrão)
   */
  architecture: 'module',

  /** Diretório raiz onde as layers ficam. Padrão: 'layers' */
  layersDir: 'layers',

  /** Diretório raiz onde os módulos flat ficam. Padrão: 'modules' */
  modulesDir: 'modules',

  /**
   * Estrutura interna das layers DDD.
   * Personalize para adaptar à convenção do seu projeto.
   */
  layerDirs: {
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
  },

  /**
   * Estrutura interna dos módulos flat.
   * Personalize para adaptar à convenção do seu projeto.
   */
  moduleDirs: {
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
  },

  events: {
    enabled: true,
    root: 'core/events',
    autoRegister: true,
    autoBarrel: true,
    autoSync: true,
    generateReadme: false,
    namespaceByLayer: true,
  },
}
