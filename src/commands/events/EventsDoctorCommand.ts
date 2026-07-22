import chalk from 'chalk'
import type { ICommand } from '../ICommand.js'
import type { EventsService, ValidationIssue } from '../../services/EventsService.js'
import type { LoggerService } from '../../services/LoggerService.js'

export class EventsDoctorCommand implements ICommand {
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

    this.logger.title('Running events:doctor')

    try {
      const issues = await this.eventsService.validateAll(cwd, scanOptions)

      if (issues.length === 0) {
        console.log(`  ${chalk.green('✔')} No issues found. Everything looks healthy.`)
        console.log()
        return
      }

      console.log(
        `  ${chalk.yellow('⚠')} Found ${issues.length} issue(s):\n`,
      )

      for (const issue of issues) {
        const icon = this.iconFor(issue)
        console.log(`  ${icon} [${chalk.yellow(issue.type)}] ${issue.message}`)
        if (issue.filePath) {
          console.log(`      ${chalk.gray(issue.filePath)}`)
        }
      }

      console.log()
      this.logger.warn('Run "app events:sync" to attempt auto-repair.')
    } catch (error) {
      this.logger.error(`events:doctor failed: ${(error as Error).message}`)
      process.exit(1)
    }
  }

  private iconFor(issue: ValidationIssue): string {
    switch (issue.type) {
      case 'orphan-event': return chalk.yellow('◦')
      case 'orphan-listener': return chalk.red('✖')
      case 'duplicate-listener': return chalk.magenta('⊕')
      default: return chalk.yellow('?')
    }
  }
}
