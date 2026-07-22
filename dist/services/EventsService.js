import { glob } from 'glob';
import path from 'node:path';
import { Project } from 'ts-morph';
import { FileReader } from '../utils/FileReader.js';
export class EventsService {
    /**
     * Scans all event files and extracts metadata.
     */
    async scanEvents(eventsDir) {
        const pattern = path.join(eventsDir, 'events', '*.ts').replace(/\\/g, '/');
        const files = await glob(pattern, { ignore: ['**/index.ts'] });
        const events = [];
        for (const filePath of files) {
            const content = await FileReader.read(filePath);
            const project = new Project({ skipFileDependencyResolution: true });
            const source = project.createSourceFile('__tmp.ts', content, { overwrite: true });
            // Extract event key from const declaration
            const keyConst = source.getVariableDeclarations().find((v) => v.getName().endsWith('EventKey'));
            const key = keyConst
                ?.getInitializer()
                ?.getText()
                ?.replace(/['"]/g, '')
                ?.replace(/ as const/, '')
                ?? path.basename(filePath, '.ts').replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
            // Extract payload interface name
            const payloadInterface = source
                .getInterfaces()
                .find((i) => i.getName().endsWith('Payload'))
                ?.getName() ?? '';
            // Extract namespace from JSDoc
            const namespace = content.match(/@namespace\s+(\S+)/)?.[1];
            const name = path.basename(filePath, '.ts');
            events.push({ name, key, payloadType: payloadInterface, filePath, namespace });
        }
        return events.sort((a, b) => a.key.localeCompare(b.key));
    }
    /**
     * Scans all listener files and extracts metadata.
     */
    async scanListeners(eventsDir) {
        const pattern = path.join(eventsDir, 'listeners', '*.ts').replace(/\\/g, '/');
        const files = await glob(pattern, { ignore: ['**/index.ts'] });
        const listeners = [];
        for (const filePath of files) {
            const content = await FileReader.read(filePath);
            const className = content.match(/export class (\w+Listener)/)?.[1] ?? path.basename(filePath, '.ts');
            const handlesEventClass = content.match(/implements IEventHandler<(\w+)Payload>/)?.[1];
            const handlesEventKey = content.match(/@event\s+(\S+)/)?.[1]
                ?? content.match(/Handles:\s+(\S+)/)?.[1];
            listeners.push({ className, filePath, handlesEventKey, handlesEventClass });
        }
        return listeners.sort((a, b) => a.className.localeCompare(b.className));
    }
    /**
     * Scans events across all locations: global core/events + all layers + all modules.
     */
    async scanEventsAll(cwd, options = {}) {
        const { glob: globFn } = await import('glob');
        const layersDir = path.join(cwd, options.layersDir ?? 'layers');
        const modulesDir = path.join(cwd, options.modulesDir ?? 'modules');
        const eventsRoot = path.join(cwd, options.eventsRoot ?? 'core/events');
        const allEvents = [];
        if (await FileReader.exists(path.join(eventsRoot, 'events'))) {
            allEvents.push(...(await this.scanEvents(eventsRoot)));
        }
        const layerFiles = await globFn(path.join(layersDir, '*', 'domain', 'contracts', '*.ts').replace(/\\/g, '/'), { ignore: ['**/index.ts'] });
        for (const filePath of layerFiles) {
            const info = await this.parseEventFile(filePath);
            if (info)
                allEvents.push(info);
        }
        const moduleFiles = await globFn(path.join(modulesDir, '*', 'events', '*.ts').replace(/\\/g, '/'), { ignore: ['**/index.ts'] });
        for (const filePath of moduleFiles) {
            const info = await this.parseEventFile(filePath);
            if (info)
                allEvents.push(info);
        }
        const seen = new Set();
        return allEvents
            .filter((e) => {
            if (seen.has(e.name))
                return false;
            seen.add(e.name);
            return true;
        })
            .sort((a, b) => a.key.localeCompare(b.key));
    }
    /**
     * Scans listeners across all locations.
     */
    async scanListenersAll(cwd, options = {}) {
        const { glob: globFn } = await import('glob');
        const layersDir = path.join(cwd, options.layersDir ?? 'layers');
        const modulesDir = path.join(cwd, options.modulesDir ?? 'modules');
        const eventsRoot = path.join(cwd, options.eventsRoot ?? 'core/events');
        const allListeners = [];
        if (await FileReader.exists(path.join(eventsRoot, 'listeners'))) {
            allListeners.push(...(await this.scanListeners(eventsRoot)));
        }
        const layerFiles = await globFn(path.join(layersDir, '*', 'application', 'usecases', '*Listener.ts').replace(/\\/g, '/'), { ignore: ['**/index.ts'] });
        for (const filePath of layerFiles) {
            const info = await this.parseListenerFile(filePath);
            if (info)
                allListeners.push(info);
        }
        const moduleFiles = await globFn(path.join(modulesDir, '*', 'listeners', '*.ts').replace(/\\/g, '/'), { ignore: ['**/index.ts'] });
        for (const filePath of moduleFiles) {
            const info = await this.parseListenerFile(filePath);
            if (info)
                allListeners.push(info);
        }
        const seen = new Set();
        return allListeners
            .filter((l) => {
            if (seen.has(l.className))
                return false;
            seen.add(l.className);
            return true;
        })
            .sort((a, b) => a.className.localeCompare(b.className));
    }
    async parseEventFile(filePath) {
        try {
            const content = await FileReader.read(filePath);
            if (!content.includes('EventKey') && !content.includes('Payload'))
                return null;
            const project = new Project({ skipFileDependencyResolution: true });
            const source = project.createSourceFile('__tmp.ts', content, { overwrite: true });
            const keyConst = source
                .getVariableDeclarations()
                .find((v) => v.getName().endsWith('EventKey'));
            const key = keyConst
                ?.getInitializer()
                ?.getText()
                ?.replace(/['"]/g, '')
                ?.replace(/ as const/, '') ??
                path
                    .basename(filePath, '.ts')
                    .replace(/([A-Z])/g, '-$1')
                    .toLowerCase()
                    .slice(1);
            const payloadInterface = source
                .getInterfaces()
                .find((i) => i.getName().endsWith('Payload'))
                ?.getName() ?? '';
            const namespace = content.match(/@namespace\s+(\S+)/)?.[1];
            const name = path.basename(filePath, '.ts');
            return { name, key, payloadType: payloadInterface, filePath, namespace };
        }
        catch {
            return null;
        }
    }
    async parseListenerFile(filePath) {
        try {
            const content = await FileReader.read(filePath);
            if (!content.includes('Listener'))
                return null;
            const className = content.match(/export class (\w+Listener)/)?.[1] ?? path.basename(filePath, '.ts');
            const handlesEventClass = content.match(/implements IEventHandler<(\w+)Payload>/)?.[1];
            const handlesEventKey = content.match(/@event\s+(\S+)/)?.[1] ?? content.match(/Handles:\s+(\S+)/)?.[1];
            return { className, filePath, handlesEventKey, handlesEventClass };
        }
        catch {
            return null;
        }
    }
    /**
     * Updates EventMap.ts using ts-morph — no regex.
     */
    async updateEventMap(eventMapPath, events) {
        const exists = await FileReader.exists(eventMapPath);
        if (!exists)
            return;
        const project = new Project({ skipFileDependencyResolution: true });
        const source = project.addSourceFileAtPath(eventMapPath);
        // Remove old import lines for events
        source.getImportDeclarations()
            .filter((imp) => imp.getModuleSpecifierValue().includes('./events/'))
            .forEach((imp) => imp.remove());
        // Add fresh imports
        const importInsertIndex = 0;
        const autoComment = source.getStatements().find(s => s.getText().includes('Auto-generated'));
        const insertPos = autoComment ? autoComment.getChildIndex() + 1 : importInsertIndex;
        for (const event of events) {
            source.insertImportDeclaration(insertPos, {
                namedImports: [`${event.payloadType}`],
                moduleSpecifier: `./events/${event.name}`,
                isTypeOnly: true,
            });
        }
        // Update the EventMap interface
        const iface = source.getInterface('EventMap');
        if (iface) {
            // Remove old properties
            iface.getProperties().forEach((p) => p.remove());
            // Add sorted properties
            for (const event of events) {
                if (event.payloadType) {
                    iface.addProperty({ name: `'${event.key}'`, type: event.payloadType });
                }
            }
        }
        await project.save();
    }
    /**
     * Updates EventRegistry.ts using ts-morph — no regex.
     */
    async updateRegistry(registryPath, registrations) {
        const exists = await FileReader.exists(registryPath);
        if (!exists)
            return;
        const project = new Project({ skipFileDependencyResolution: true });
        const source = project.addSourceFileAtPath(registryPath);
        // Remove old listener imports
        source.getImportDeclarations()
            .filter((imp) => imp.getModuleSpecifierValue().includes('./listeners/'))
            .forEach((imp) => imp.remove());
        // Remove old event imports (key consts)
        source.getImportDeclarations()
            .filter((imp) => imp.getModuleSpecifierValue().includes('./events/'))
            .forEach((imp) => imp.remove());
        // Add fresh imports
        const unique = new Map();
        for (const reg of registrations) {
            unique.set(reg.listenerClass, reg);
        }
        let idx = 0;
        for (const reg of unique.values()) {
            source.insertImportDeclaration(idx++, {
                namedImports: [reg.listenerClass],
                moduleSpecifier: `./listeners/${reg.listenerClass}`,
            });
            source.insertImportDeclaration(idx++, {
                namedImports: [`${this.toCamel(reg.eventClass)}EventKey`],
                moduleSpecifier: `./events/${reg.eventClass}`,
            });
        }
        // Update registerEvents function body
        const fn = source.getFunction('registerEvents');
        if (fn) {
            const body = fn.getBody();
            if (body) {
                // Replace entire body
                const lines = registrations.map((reg) => `bus.on(${this.toCamel(reg.eventClass)}EventKey, new ${reg.listenerClass}().handle.bind(new ${reg.listenerClass}()))`);
                body.replaceWithText(`{\n  ${lines.join('\n  ')}\n}`);
            }
        }
        await project.save();
    }
    /**
     * Validates consistency across all layers, modules and core/events.
     */
    async validateAll(cwd, options = {}) {
        const events = await this.scanEventsAll(cwd, options);
        const listeners = await this.scanListenersAll(cwd, options);
        return this.runValidation(events, listeners);
    }
    /**
     * Validates consistency between events, listeners and registry.
     */
    async validate(eventsDir) {
        const events = await this.scanEvents(eventsDir);
        const listeners = await this.scanListeners(eventsDir);
        return this.runValidation(events, listeners);
    }
    runValidation(events, listeners) {
        const issues = [];
        const eventClasses = new Set(events.map((e) => e.name));
        // Listeners without matching event
        for (const listener of listeners) {
            const handles = listener.handlesEventClass;
            if (handles && !eventClasses.has(handles)) {
                issues.push({
                    type: 'orphan-listener',
                    message: `Listener "${listener.className}" references event "${handles}" which does not exist.`,
                    filePath: listener.filePath,
                });
            }
        }
        // Events without any listener
        for (const event of events) {
            const hasListener = listeners.some((l) => l.handlesEventClass === event.name);
            if (!hasListener) {
                issues.push({
                    type: 'orphan-event',
                    message: `Event "${event.name}" (${event.key}) has no registered listeners.`,
                    filePath: event.filePath,
                });
            }
        }
        // Duplicate listeners for the same event
        const seen = new Map();
        for (const listener of listeners) {
            const key = listener.handlesEventClass ?? '';
            if (!seen.has(key))
                seen.set(key, []);
            seen.get(key).push(listener.className);
        }
        for (const [eventClass, classes] of seen.entries()) {
            if (classes.length > 1) {
                issues.push({
                    type: 'duplicate-listener',
                    message: `Event "${eventClass}" has ${classes.length} listeners: ${classes.join(', ')}.`,
                });
            }
        }
        return issues;
    }
    toCamel(pascal) {
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    }
}
//# sourceMappingURL=EventsService.js.map