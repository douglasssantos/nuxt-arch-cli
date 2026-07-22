export const defaultEventsConfig = {
    enabled: true,
    root: 'core/events',
    autoRegister: true,
    autoBarrel: true,
    autoSync: true,
    generateReadme: false,
    namespaceByLayer: true,
};
export const defaultConfig = {
    layersDir: 'layers',
    nuxtConfigFile: 'nuxt.config.ts',
    nuxtCompatibility: 'auto',
    events: defaultEventsConfig,
};
export const LAYER_DIRS = {
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
};
//# sourceMappingURL=index.js.map