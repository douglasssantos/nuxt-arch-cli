import type { ICommand } from './ICommand.js'
import type { ModelGenerator } from '../generators/ModelGenerator.js'
import type { MapperGenerator } from '../generators/MapperGenerator.js'
import type { RepositoryGenerator } from '../generators/RepositoryGenerator.js'
import type { ServiceGenerator } from '../generators/ServiceGenerator.js'
import type { StoreGenerator } from '../generators/StoreGenerator.js'
import type { LoggerService } from '../services/LoggerService.js'
import { Validator } from '../utils/Validator.js'

export interface MakeModuleCommandOptions {
  force?: boolean
  cwd?: string
}

/**
 * Scaffolds a complete module: model + mapper + repository + service + store.
 */
export class MakeModuleCommand implements ICommand {
  constructor(
    private readonly layer: string,
    private readonly name: string,
    private readonly generators: {
      model: ModelGenerator
      mapper: MapperGenerator
      repository: RepositoryGenerator
      service: ServiceGenerator
      store: StoreGenerator
    },
    private readonly logger: LoggerService,
    private readonly options: MakeModuleCommandOptions = {},
  ) {}

  async execute(): Promise<void> {
    try {
      Validator.assertNonEmpty(this.layer, 'Layer')
      Validator.assertNonEmpty(this.name, 'Name')
      Validator.assertValidName(this.name)

      this.logger.title(`Creating module: ${this.name} in layer "${this.layer}"`)

      const opts = { layer: this.layer, name: this.name, force: this.options.force }

      await this.generators.model.generate(opts)
      await this.generators.mapper.generate(opts)
      await this.generators.repository.generate(opts)
      await this.generators.service.generate(opts)
      await this.generators.store.generate(opts)

      this.logger.newLine()
      this.logger.success(`Module "${this.name}" created successfully in layer "${this.layer}".`)
    } catch (error) {
      this.logger.error(`Failed to create module: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
