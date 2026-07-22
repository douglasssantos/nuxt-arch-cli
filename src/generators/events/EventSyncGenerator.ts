import path from 'node:path'
import { EventsService } from '../../services/EventsService.js'
import { LoggerService } from '../../services/LoggerService.js'
import { FileReader } from '../../utils/FileReader.js'

export interface EventSyncOptions {
  eventsRoot?: string
  layersDir?: string
  modulesDir?: string
  cwd?: string
}

export class EventSyncGenerator {
  constructor(
    private readonly eventsService: EventsService,
    private readonly logger: LoggerService,
  ) {}

  async sync(options: EventSyncOptions = {}): Promise<void> {
    const cwd = options.cwd ?? process.cwd()
    const eventsRoot = path.join(cwd, options.eventsRoot ?? 'core/events')

    const rootExists = await FileReader.exists(eventsRoot)
    if (!rootExists) {
      throw new Error(`Events root not found at "${eventsRoot}". Run "app events:install" first.`)
    }

    this.logger.title('Syncing Event Bus')

    const scanOptions = {
      layersDir: options.layersDir ?? 'layers',
      modulesDir: options.modulesDir ?? 'modules',
      eventsRoot: options.eventsRoot ?? 'core/events',
    }

    const events = await this.eventsService.scanEventsAll(cwd, scanOptions)
    const listeners = await this.eventsService.scanListenersAll(cwd, scanOptions)

    this.logger.info(`Found ${events.length} event(s), ${listeners.length} listener(s).`)

    const registrations = listeners
      .filter((l) => l.handlesEventClass)
      .map((l) => {
        const event = events.find((e) => e.name === l.handlesEventClass)
        return {
          eventKey: event?.key ?? l.handlesEventKey ?? '',
          eventClass: l.handlesEventClass!,
          listenerClass: l.className,
        }
      })
      .filter((r) => r.eventKey)

    const eventMapPath = path.join(eventsRoot, 'EventMap.ts')
    if (await FileReader.exists(eventMapPath)) {
      await this.eventsService.updateEventMap(eventMapPath, events)
      this.logger.updated(eventMapPath)
    }

    const registryPath = path.join(eventsRoot, 'EventRegistry.ts')
    if (await FileReader.exists(registryPath)) {
      await this.eventsService.updateRegistry(registryPath, registrations)
      this.logger.updated(registryPath)
    }

    this.logger.newLine()
    this.logger.success(`Sync complete. ${registrations.length} registration(s) active.`)
  }
}
