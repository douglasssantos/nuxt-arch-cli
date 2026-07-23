import type { ICommand } from '../ICommand.js'
import type { EventSyncGenerator } from '../../generators/events/EventSyncGenerator.js'
import type { LoggerService } from '../../services/LoggerService.js'

export class EventsSyncCommand implements ICommand {
  constructor(
    private readonly generator: EventSyncGenerator,
    private readonly logger: LoggerService,
    private readonly options: { eventsRoot?: string; layersDir?: string; modulesDir?: string; cwd?: string } = {},
  ) {}

  async execute(): Promise<void> {
    try {
      await this.generator.sync(this.options)
    } catch (error) {
      this.logger.error(`events:sync failed: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
