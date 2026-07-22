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
export class Container {
    cwd;
    logger;
    fileService;
    templateService;
    formatterService;
    nuxtConfigService;
    barrelService;
    configService;
    pathResolver;
    layerGenerator;
    modelGenerator;
    mapperGenerator;
    repositoryGenerator;
    serviceGenerator;
    storeGenerator;
    useCaseGenerator;
    dtoGenerator;
    eventGenerator;
    listenerGenerator;
    pageGenerator;
    componentGenerator;
    composableGenerator;
    pluginGenerator;
    middlewareGenerator;
    enumGenerator;
    interfaceGenerator;
    flatModuleGenerator;
    eventsService;
    eventInstallGenerator;
    eventMakeGenerator;
    eventListenerGenerator;
    eventSyncGenerator;
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
        // Services
        this.logger = new LoggerService();
        this.fileService = new FileService();
        this.templateService = new TemplateService();
        this.formatterService = new FormatterService();
        this.nuxtConfigService = new NuxtConfigService();
        this.barrelService = new BarrelService();
        this.configService = new ConfigService();
        this.pathResolver = new PathResolver(cwd);
        const baseArgs = [
            this.fileService,
            this.templateService,
            this.formatterService,
            this.barrelService,
            this.logger,
            this.pathResolver,
        ];
        // Generators
        this.layerGenerator = new LayerGenerator(this.fileService, this.templateService, this.formatterService, this.nuxtConfigService, this.logger, this.pathResolver);
        this.modelGenerator = new ModelGenerator(...baseArgs);
        this.mapperGenerator = new MapperGenerator(...baseArgs);
        this.repositoryGenerator = new RepositoryGenerator(...baseArgs);
        this.serviceGenerator = new ServiceGenerator(...baseArgs);
        this.storeGenerator = new StoreGenerator(...baseArgs);
        this.useCaseGenerator = new UseCaseGenerator(...baseArgs);
        this.dtoGenerator = new DtoGenerator(...baseArgs);
        this.eventGenerator = new EventGenerator(...baseArgs);
        this.listenerGenerator = new ListenerGenerator(...baseArgs);
        this.pageGenerator = new PageGenerator(...baseArgs);
        this.componentGenerator = new ComponentGenerator(...baseArgs);
        this.composableGenerator = new ComposableGenerator(...baseArgs);
        this.pluginGenerator = new PluginGenerator(...baseArgs);
        this.middlewareGenerator = new MiddlewareGenerator(...baseArgs);
        this.enumGenerator = new EnumGenerator(...baseArgs);
        this.interfaceGenerator = new InterfaceGenerator(...baseArgs);
        this.flatModuleGenerator = new FlatModuleGenerator(this.fileService, this.templateService, this.formatterService, this.barrelService, this.logger, this.pathResolver);
        // Events
        this.eventsService = new EventsService();
        this.eventInstallGenerator = new EventInstallGenerator(this.fileService, this.templateService, this.formatterService, this.logger);
        this.eventMakeGenerator = new EventMakeGenerator(this.fileService, this.templateService, this.formatterService, this.barrelService, this.eventsService, this.logger);
        this.eventListenerGenerator = new EventListenerGenerator(this.fileService, this.templateService, this.formatterService, this.barrelService, this.logger);
        this.eventSyncGenerator = new EventSyncGenerator(this.eventsService, this.logger);
    }
}
//# sourceMappingURL=Container.js.map