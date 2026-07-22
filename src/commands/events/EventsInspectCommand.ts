import chalk from 'chalk'
import { FileReader } from '../../utils/FileReader.js'
import type { ICommand } from '../ICommand.js'
import type { EventsService } from '../../services/EventsService.js'
import type { LoggerService } from '../../services/LoggerService.js'

export class EventsInspectCommand implements ICommand {
  constructor(
    private readonly eventKey: string,
    private readonly eventsService: EventsService,
    private readonly logger: LoggerService,
    private readonly options: { eventsRoot?: string; layersDir?: string; modulesDir?: string; cwd?: string } = {},
  ) {}

  async execute(): Promise<void> {
    const cwd = this.options.cwd ?? process.cwd()

    const scanOptions = {
      eventsRoot: this.options.eventsRoot ?? 'core/events',
      layersDir: this.options.layersDir ?? 'layers',
      modulesDir: this.options.modulesDir ?? 'modules',
    }

    try {
      const events = await this.eventsService.scanEventsAll(cwd, scanOptions)
      const listeners = await this.eventsService.scanListenersAll(cwd, scanOptions)

      const event = events.find(
        (e) => e.key === this.eventKey || e.name === this.eventKey,
      )

      if (!event) {
        this.logger.error(`Event "${this.eventKey}" not found.`)
        process.exit(1)
      }

      const eventListeners = listeners.filter((l) => l.handlesEventClass === event.name)

      // Read payload fields from event file
      const content = await FileReader.read(event.filePath)
      const payloadMatch = content.match(/export interface \w+Payload \{([^}]*)\}/s)
      const payloadFields = payloadMatch
        ? payloadMatch[1]
            .split('\n')
            .map((l) => l.trim())
            .filter((l) => l && !l.startsWith('//'))
        : []

      console.log()
      console.log(chalk.bold.cyan('  Event'))
      console.log()
      console.log(`  ${chalk.white(event.key)}`)
      console.log()
      console.log(chalk.bold('  Payload'))
      console.log()
      if (payloadFields.length === 0 || payloadFields.every(l => l.includes('TODO'))) {
        console.log(`  ${chalk.gray('(not defined yet)')}`)
      } else {
        for (const field of payloadFields) {
          console.log(`  ${chalk.cyan(field)}`)
        }
      }
      console.log()
      console.log(chalk.bold('  Listeners'))
      console.log()
      if (eventListeners.length === 0) {
        console.log(`  ${chalk.gray('— none')}`)
      } else {
        for (const listener of eventListeners) {
          console.log(`  ${chalk.green('✔')} ${listener.className}`)
        }
      }
      console.log()
    } catch (error) {
      this.logger.error(`events:inspect failed: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
