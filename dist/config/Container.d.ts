import { FileService } from '../services/FileService.js';
import { TemplateService } from '../services/TemplateService.js';
import { FormatterService } from '../services/FormatterService.js';
import { LoggerService } from '../services/LoggerService.js';
import { NuxtConfigService } from '../services/NuxtConfigService.js';
import { BarrelService } from '../services/BarrelService.js';
import { ConfigService } from '../services/ConfigService.js';
import { PathResolver } from '../utils/PathResolver.js';
import { LayerGenerator } from '../generators/LayerGenerator.js';
import { ModelGenerator } from '../generators/ModelGenerator.js';
import { MapperGenerator } from '../generators/MapperGenerator.js';
import { RepositoryGenerator } from '../generators/RepositoryGenerator.js';
import { ServiceGenerator } from '../generators/ServiceGenerator.js';
import { StoreGenerator } from '../generators/StoreGenerator.js';
import { UseCaseGenerator } from '../generators/UseCaseGenerator.js';
import { DtoGenerator } from '../generators/DtoGenerator.js';
import { EventGenerator } from '../generators/EventGenerator.js';
import { ListenerGenerator } from '../generators/ListenerGenerator.js';
import { PageGenerator } from '../generators/PageGenerator.js';
import { ComponentGenerator } from '../generators/ComponentGenerator.js';
import { ComposableGenerator } from '../generators/ComposableGenerator.js';
import { PluginGenerator } from '../generators/PluginGenerator.js';
import { MiddlewareGenerator } from '../generators/MiddlewareGenerator.js';
import { EnumGenerator } from '../generators/EnumGenerator.js';
import { InterfaceGenerator } from '../generators/InterfaceGenerator.js';
import { FlatModuleGenerator } from '../generators/FlatModuleGenerator.js';
import { EventInstallGenerator } from '../generators/events/EventInstallGenerator.js';
import { EventMakeGenerator } from '../generators/events/EventMakeGenerator.js';
import { EventListenerGenerator } from '../generators/events/EventListenerGenerator.js';
import { EventSyncGenerator } from '../generators/events/EventSyncGenerator.js';
import { EventsService } from '../services/EventsService.js';
/**
 * Lightweight service container — wires up all dependencies.
 * Replaces a full IoC container to keep things simple.
 */
export declare class Container {
    readonly cwd: string;
    readonly logger: LoggerService;
    readonly fileService: FileService;
    readonly templateService: TemplateService;
    readonly formatterService: FormatterService;
    readonly nuxtConfigService: NuxtConfigService;
    readonly barrelService: BarrelService;
    readonly configService: ConfigService;
    readonly pathResolver: PathResolver;
    readonly layerGenerator: LayerGenerator;
    readonly modelGenerator: ModelGenerator;
    readonly mapperGenerator: MapperGenerator;
    readonly repositoryGenerator: RepositoryGenerator;
    readonly serviceGenerator: ServiceGenerator;
    readonly storeGenerator: StoreGenerator;
    readonly useCaseGenerator: UseCaseGenerator;
    readonly dtoGenerator: DtoGenerator;
    readonly eventGenerator: EventGenerator;
    readonly listenerGenerator: ListenerGenerator;
    readonly pageGenerator: PageGenerator;
    readonly componentGenerator: ComponentGenerator;
    readonly composableGenerator: ComposableGenerator;
    readonly pluginGenerator: PluginGenerator;
    readonly middlewareGenerator: MiddlewareGenerator;
    readonly enumGenerator: EnumGenerator;
    readonly interfaceGenerator: InterfaceGenerator;
    readonly flatModuleGenerator: FlatModuleGenerator;
    readonly eventsService: EventsService;
    readonly eventInstallGenerator: EventInstallGenerator;
    readonly eventMakeGenerator: EventMakeGenerator;
    readonly eventListenerGenerator: EventListenerGenerator;
    readonly eventSyncGenerator: EventSyncGenerator;
    constructor(cwd?: string);
}
//# sourceMappingURL=Container.d.ts.map