import type { ICommand } from '../ICommand.js'
import type { EventMakeGenerator } from '../../generators/events/EventMakeGenerator.js'
import type { LoggerService } from '../../services/LoggerService.js'
import { Validator } from '../../utils/Validator.js'

export class EventsMakeCommand implements ICommand {
  constructor(
    private readonly name: string,
    private readonly generator: EventMakeGenerator,
    private readonly logger: LoggerService,
    private readonly options: { force?: boolean; namespace?: string; eventsRoot?: string; cwd?: string; target?: string; targetKind?: 'layer' | 'module' } = {},
  ) {}

  async execute(): Promise<void> {
    try {
      Validator.assertNonEmpty(this.name, 'Event name')
      Validator.assertValidName(this.name)
      await this.generator.generate(this.name, this.options)
    } catch (error) {
      this.logger.error(`events:make failed: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
