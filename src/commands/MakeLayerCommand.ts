import type { ICommand } from './ICommand.js'
import type { LayerGenerator } from '../generators/LayerGenerator.js'
import type { LoggerService } from '../services/LoggerService.js'
import { Validator } from '../utils/Validator.js'

export interface MakeLayerCommandOptions {
  force?: boolean
  cwd?: string
}

export class MakeLayerCommand implements ICommand {
  constructor(
    private readonly layerName: string,
    private readonly generator: LayerGenerator,
    private readonly logger: LoggerService,
    private readonly options: MakeLayerCommandOptions = {},
  ) {}

  async execute(): Promise<void> {
    try {
      Validator.assertNonEmpty(this.layerName, 'Layer name')
      Validator.assertValidLayerName(this.layerName)

      await this.generator.generate(this.layerName, this.options)
    } catch (error) {
      this.logger.error(`Failed to create layer: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
