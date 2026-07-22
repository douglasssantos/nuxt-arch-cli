import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FileService } from '../services/FileService.js'
import { LoggerService } from '../services/LoggerService.js'
import type { ICommand } from './ICommand.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATE_PATH = path.resolve(__dirname, '..', 'templates', 'nuxt-cli.config.example.ts')
const CONFIG_FILENAME = 'nuxt-cli.config.ts'

export interface InitCommandOptions {
  force?: boolean
  cwd?: string
}

export class InitCommand implements ICommand {
  constructor(
    private readonly fileService: FileService,
    private readonly logger: LoggerService,
    private readonly options: InitCommandOptions = {},
  ) {}

  async execute(): Promise<void> {
    const cwd = this.options.cwd ?? process.cwd()
    const destPath = path.join(cwd, CONFIG_FILENAME)

    this.logger.title('Nuxt — Publish Config')

    const exists = await this.fileService.exists(destPath)

    if (exists && !this.options.force) {
      this.logger.skipped(destPath, 'already exists (use --force to overwrite)')
      this.logger.newLine()
      this.logger.info(`Edit ${CONFIG_FILENAME} to configure the CLI for your project.`)
      return
    }

    try {
      const content = await this.fileService.read(TEMPLATE_PATH)
      await this.fileService.write(destPath, content)

      if (exists) {
        this.logger.updated(destPath)
      } else {
        this.logger.created(destPath)
      }

      this.logger.newLine()
      this.logger.success(`${CONFIG_FILENAME} created. Edit it to configure the CLI for your project.`)
      this.logger.newLine()
      this.logger.info('Key settings:')
      console.log('  architecture  "layer" | "module" | "auto"')
      console.log('  layersDir     directory for DDD layers  (default: layers)')
      console.log('  modulesDir    directory for flat modules (default: modules)')
      console.log('  events.root   directory for event bus   (default: core/events)')
    } catch (error) {
      this.logger.error(`init failed: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
