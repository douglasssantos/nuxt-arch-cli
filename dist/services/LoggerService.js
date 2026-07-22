import chalk from 'chalk';
import ora from 'ora';
export class LoggerService {
    spinner = null;
    success(message) {
        console.log(`${chalk.green('✔')} ${message}`);
    }
    error(message) {
        console.error(`${chalk.red('✖')} ${message}`);
    }
    warn(message) {
        console.warn(`${chalk.yellow('⚠')} ${message}`);
    }
    info(message) {
        console.log(`${chalk.blue('ℹ')} ${message}`);
    }
    created(filePath) {
        console.log(`${chalk.green('CREATE')} ${chalk.white(filePath)}`);
    }
    updated(filePath) {
        console.log(`${chalk.cyan('UPDATE')} ${chalk.white(filePath)}`);
    }
    skipped(filePath, reason) {
        const reasonText = reason ? chalk.gray(` (${reason})`) : '';
        console.log(`${chalk.yellow('SKIP  ')} ${chalk.white(filePath)}${reasonText}`);
    }
    startSpinner(message) {
        this.spinner = ora({ text: message, color: 'cyan' }).start();
    }
    stopSpinner(message) {
        if (this.spinner) {
            if (message) {
                this.spinner.succeed(message);
            }
            else {
                this.spinner.stop();
            }
            this.spinner = null;
        }
    }
    failSpinner(message) {
        if (this.spinner) {
            this.spinner.fail(message);
            this.spinner = null;
        }
    }
    newLine() {
        console.log();
    }
    title(message) {
        console.log();
        console.log(chalk.bold.cyan(`  ${message}`));
        console.log(chalk.cyan(`  ${'─'.repeat(message.length)}`));
        console.log();
    }
}
//# sourceMappingURL=LoggerService.js.map