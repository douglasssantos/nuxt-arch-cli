import chalk from 'chalk'
import type { ICommand } from '../ICommand.js'
import type { EventsService } from '../../services/EventsService.js'
import type { LoggerService } from '../../services/LoggerService.js'

export class EventsListCommand implements ICommand {
  constructor(
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

      if (events.length === 0) {
        this.logger.warn('No events found. Run "app events:make <name>" to create one.')
        return
      }

      console.log()
      console.log(chalk.bold.cyan('  Registered Events'))
      console.log()

      for (const event of events) {
        const eventListeners = listeners.filter((l) => l.handlesEventClass === event.name)
        console.log(`  ${chalk.green('✔')} ${chalk.white(event.key)} ${chalk.gray(`(${event.name})`)}`)

        if (eventListeners.length === 0) {
          console.log(`      ${chalk.gray('— no listeners')}`)
        } else {
          for (const listener of eventListeners) {
            console.log(`      ${chalk.cyan('›')} ${listener.className}`)
          }
        }
        console.log()
      }

      console.log(
        chalk.gray(`  ${events.length} event(s), ${listeners.length} listener(s) total.`),
      )
      console.log()
    } catch (error) {
      this.logger.error(`events:list failed: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
