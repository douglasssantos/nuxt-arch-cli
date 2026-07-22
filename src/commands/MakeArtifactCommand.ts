import type { ICommand } from './ICommand.js'
import type { BaseGenerator, GeneratorOptions } from '../generators/BaseGenerator.js'
import type { LoggerService } from '../services/LoggerService.js'
import { Validator } from '../utils/Validator.js'

/**
 * Generic command for all make:* commands that target a specific layer.
 * Avoids boilerplate by parameterizing the generator.
 */
export class MakeArtifactCommand implements ICommand {
  constructor(
    private readonly layer: string,
    private readonly name: string,
    private readonly generator: BaseGenerator,
    private readonly logger: LoggerService,
    private readonly options: Omit<GeneratorOptions, 'layer' | 'name'> = {},
  ) {}

  async execute(): Promise<void> {
    try {
      Validator.assertNonEmpty(this.layer, 'Layer name')
      Validator.assertNonEmpty(this.name, 'Name')
      Validator.assertValidName(this.name)

      await this.generator.generate({ layer: this.layer, name: this.name, ...this.options })
    } catch (error) {
      this.logger.error(`Failed: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
