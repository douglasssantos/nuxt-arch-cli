export interface EventInfo {
    name: string;
    key: string;
    payloadType: string;
    filePath: string;
    namespace?: string;
}
export interface ListenerInfo {
    className: string;
    filePath: string;
    handlesEventKey?: string;
    handlesEventClass?: string;
}
export interface RegistrationInfo {
    eventKey: string;
    eventClass: string;
    listenerClass: string;
}
export interface ValidationIssue {
    type: 'orphan-event' | 'orphan-listener' | 'duplicate-listener' | 'missing-registry' | 'barrel-inconsistency';
    message: string;
    filePath?: string;
}
export declare class EventsService {
    /**
     * Scans all event files and extracts metadata.
     */
    scanEvents(eventsDir: string): Promise<EventInfo[]>;
    /**
     * Scans all listener files and extracts metadata.
     */
    scanListeners(eventsDir: string): Promise<ListenerInfo[]>;
    /**
     * Scans events across all locations: global core/events + all layers + all modules.
     */
    scanEventsAll(cwd: string, options?: {
        layersDir?: string;
        modulesDir?: string;
        eventsRoot?: string;
    }): Promise<EventInfo[]>;
    /**
     * Scans listeners across all locations.
     */
    scanListenersAll(cwd: string, options?: {
        layersDir?: string;
        modulesDir?: string;
        eventsRoot?: string;
    }): Promise<ListenerInfo[]>;
    private parseEventFile;
    private parseListenerFile;
    /**
     * Updates EventMap.ts using ts-morph — no regex.
     */
    updateEventMap(eventMapPath: string, events: EventInfo[]): Promise<void>;
    /**
     * Updates EventRegistry.ts using ts-morph — no regex.
     */
    updateRegistry(registryPath: string, registrations: RegistrationInfo[]): Promise<void>;
    /**
     * Validates consistency across all layers, modules and core/events.
     */
    validateAll(cwd: string, options?: {
        layersDir?: string;
        modulesDir?: string;
        eventsRoot?: string;
    }): Promise<ValidationIssue[]>;
    /**
     * Validates consistency between events, listeners and registry.
     */
    validate(eventsDir: string): Promise<ValidationIssue[]>;
    private runValidation;
    private toCamel;
}
//# sourceMappingURL=EventsService.d.ts.map