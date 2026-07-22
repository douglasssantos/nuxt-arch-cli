import type { ICommand } from '../ICommand.js'
import type { EventListenerGenerator } from '../../generators/events/EventListenerGenerator.js'
import type { LoggerService } from '../../services/LoggerService.js'
import { Validator } from '../../utils/Validator.js'

export class EventsListenerCommand implements ICommand {
  constructor(
    private readonly name: string,
    private readonly generator: EventListenerGenerator,
    private readonly logger: LoggerService,
    private readonly options: {
      force?: boolean
      eventName?: string
      eventKey?: string
      eventsRoot?: string
      cwd?: string
      target?: string
      targetKind?: 'layer' | 'module'
    } = {},
  ) {}

  async execute(): Promise<void> {
    try {
      Validator.assertNonEmpty(this.name, 'Listener name')
      await this.generator.generate(this.name, this.options)
    } catch (error) {
      this.logger.error(`events:listener failed: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
