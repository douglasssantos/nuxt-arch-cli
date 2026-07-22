import type { ICommand } from '../ICommand.js'
import type { EventInstallGenerator } from '../../generators/events/EventInstallGenerator.js'
import type { LoggerService } from '../../services/LoggerService.js'

export class EventsInstallCommand implements ICommand {
  constructor(
    private readonly generator: EventInstallGenerator,
    private readonly logger: LoggerService,
    private readonly options: { force?: boolean; eventsRoot?: string; cwd?: string } = {},
  ) {}

  async execute(): Promise<void> {
    try {
      await this.generator.generate(this.options)
    } catch (error) {
      this.logger.error(`events:install failed: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
