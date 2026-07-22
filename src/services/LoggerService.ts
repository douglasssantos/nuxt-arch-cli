import chalk from 'chalk'
import ora, { type Ora } from 'ora'

export class LoggerService {
  private spinner: Ora | null = null

  success(message: string): void {
    console.log(`${chalk.green('✔')} ${message}`)
  }

  error(message: string): void {
    console.error(`${chalk.red('✖')} ${message}`)
  }

  warn(message: string): void {
    console.warn(`${chalk.yellow('⚠')} ${message}`)
  }

  info(message: string): void {
    console.log(`${chalk.blue('ℹ')} ${message}`)
  }

  created(filePath: string): void {
    console.log(`${chalk.green('CREATE')} ${chalk.white(filePath)}`)
  }

  updated(filePath: string): void {
    console.log(`${chalk.cyan('UPDATE')} ${chalk.white(filePath)}`)
  }

  skipped(filePath: string, reason?: string): void {
    const reasonText = reason ? chalk.gray(` (${reason})`) : ''
    console.log(`${chalk.yellow('SKIP  ')} ${chalk.white(filePath)}${reasonText}`)
  }

  startSpinner(message: string): void {
    this.spinner = ora({ text: message, color: 'cyan' }).start()
  }

  stopSpinner(message?: string): void {
    if (this.spinner) {
      if (message) {
        this.spinner.succeed(message)
      } else {
        this.spinner.stop()
      }
      this.spinner = null
    }
  }

  failSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.fail(message)
      this.spinner = null
    }
  }

  newLine(): void {
    console.log()
  }

  title(message: string): void {
    console.log()
    console.log(chalk.bold.cyan(`  ${message}`))
    console.log(chalk.cyan(`  ${'─'.repeat(message.length)}`))
    console.log()
  }
}
