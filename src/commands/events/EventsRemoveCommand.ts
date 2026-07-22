import path from 'node:path'
import { FileReader } from '../../utils/FileReader.js'
import fs from 'fs-extra'
import { EventsService } from '../../services/EventsService.js'
import { Prompt } from '../../utils/Prompt.js'
import { NameResolver } from '../../utils/NameResolver.js'
import type { ICommand } from '../ICommand.js'
import type { LoggerService } from '../../services/LoggerService.js'

export class EventsRemoveCommand implements ICommand {
  constructor(
    private readonly eventName: string,
    private readonly eventsService: EventsService,
    private readonly logger: LoggerService,
    private readonly options: { force?: boolean; eventsRoot?: string; cwd?: string } = {},
  ) {}

  async execute(): Promise<void> {
    const cwd = this.options.cwd ?? process.cwd()
    const eventsRoot = path.join(cwd, this.options.eventsRoot ?? 'core/events')
    const names = NameResolver.resolve(this.eventName)
    const filePath = path.join(eventsRoot, 'events', `${names.pascal}.ts`)

    try {
      const exists = await FileReader.exists(filePath)
      if (!exists) {
        this.logger.error(`Event "${names.pascal}" not found at ${filePath}`)
        process.exit(1)
      }

      if (!this.options.force) {
        const confirmed = await Prompt.confirm(
          `Remove event "${names.pascal}" and update EventMap + Registry?`,
        )
        if (!confirmed) {
          this.logger.info('Aborted.')
          return
        }
      }

      await fs.remove(filePath)
      this.logger.success(`Removed ${filePath}`)

      // Update barrel
      const barrelPath = path.join(eventsRoot, 'events', 'index.ts')
      const barrelContent = await FileReader.read(barrelPath).catch(() => '')
      const updated = barrelContent
        .split('\n')
        .filter((l) => !l.includes(`'./${names.pascal}'`))
        .join('\n')
      await fs.writeFile(barrelPath, updated, 'utf-8')
      this.logger.updated(barrelPath)

      // Re-sync EventMap and Registry
      const events = await this.eventsService.scanEvents(eventsRoot)
      await this.eventsService.updateEventMap(path.join(eventsRoot, 'EventMap.ts'), events)
      this.logger.updated(path.join(eventsRoot, 'EventMap.ts'))

      this.logger.newLine()
      this.logger.info('Run "app events:sync" to also clean up orphan listeners.')
    } catch (error) {
      this.logger.error(`events:remove failed: ${(error as Error).message}`)
      process.exit(1)
    }
  }
}
