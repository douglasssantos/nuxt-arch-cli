export interface EventsConfig {
    enabled: boolean;
    root: string;
    autoRegister: boolean;
    autoBarrel: boolean;
    autoSync: boolean;
    generateReadme: boolean;
    namespaceByLayer: boolean;
}
export interface CliConfig {
    layersDir: string;
    nuxtConfigFile: string;
    nuxtCompatibility: 'v3' | 'v4' | 'auto';
    events: EventsConfig;
}
export declare const defaultEventsConfig: EventsConfig;
export declare const defaultConfig: CliConfig;
export declare const LAYER_DIRS: {
    readonly app: {
        readonly components: "app/components";
        readonly composables: "app/composables";
        readonly middleware: "app/middleware";
        readonly pages: "app/pages";
        readonly plugins: "app/plugins";
    };
    readonly application: {
        readonly dto: "application/dto";
        readonly commands: "application/commands";
        readonly queries: "application/queries";
        readonly usecases: "application/usecases";
    };
    readonly domain: {
        readonly entities: "domain/entities";
        readonly repositories: "domain/repositories";
        readonly services: "domain/services";
        readonly contracts: "domain/contracts";
        readonly valueObjects: "domain/value-objects";
    };
    readonly infrastructure: {
        readonly api: "infrastructure/api";
        readonly mappers: "infrastructure/mappers";
        readonly repositories: "infrastructure/repositories";
        readonly stores: "infrastructure/stores";
    };
    readonly tests: "tests";
};
//# sourceMappingURL=index.d.ts.map