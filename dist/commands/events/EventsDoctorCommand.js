import chalk from 'chalk';
export class EventsDoctorCommand {
    eventsService;
    logger;
    options;
    constructor(eventsService, logger, options = {}) {
        this.eventsService = eventsService;
        this.logger = logger;
        this.options = options;
    }
    async execute() {
        const cwd = this.options.cwd ?? process.cwd();
        const scanOptions = {
            eventsRoot: this.options.eventsRoot ?? 'core/events',
            layersDir: this.options.layersDir ?? 'layers',
            modulesDir: this.options.modulesDir ?? 'modules',
        };
        this.logger.title('Running events:doctor');
        try {
            const issues = await this.eventsService.validateAll(cwd, scanOptions);
            if (issues.length === 0) {
                console.log(`  ${chalk.green('✔')} No issues found. Everything looks healthy.`);
                console.log();
                return;
            }
            console.log(`  ${chalk.yellow('⚠')} Found ${issues.length} issue(s):\n`);
            for (const issue of issues) {
                const icon = this.iconFor(issue);
                console.log(`  ${icon} [${chalk.yellow(issue.type)}] ${issue.message}`);
                if (issue.filePath) {
                    console.log(`      ${chalk.gray(issue.filePath)}`);
                }
            }
            console.log();
            this.logger.warn('Run "app events:sync" to attempt auto-repair.');
        }
        catch (error) {
            this.logger.error(`events:doctor failed: ${error.message}`);
            process.exit(1);
        }
    }
    iconFor(issue) {
        switch (issue.type) {
            case 'orphan-event': return chalk.yellow('◦');
            case 'orphan-listener': return chalk.red('✖');
            case 'duplicate-listener': return chalk.magenta('⊕');
            default: return chalk.yellow('?');
        }
    }
}
//# sourceMappingURL=EventsDoctorCommand.js.map