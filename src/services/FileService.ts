import { FileReader } from '../utils/FileReader.js'
import { FileWriter } from '../utils/FileWriter.js'

export class FileService {
  async exists(filePath: string): Promise<boolean> {
    return FileReader.exists(filePath)
  }

  async read(filePath: string): Promise<string> {
    return FileReader.read(filePath)
  }

  async write(filePath: string, content: string): Promise<void> {
    await FileWriter.write(filePath, content)
  }

  async ensureDir(dirPath: string): Promise<void> {
    await FileWriter.ensureDir(dirPath)
  }

  async ensureDirs(dirs: string[]): Promise<void> {
    await FileWriter.ensureDirs(dirs)
  }

  async safeWrite(
    filePath: string,
    content: string,
    options: { force?: boolean; onSkip?: () => void; onWrite?: () => void },
  ): Promise<boolean> {
    const exists = await this.exists(filePath)

    if (exists && !options.force) {
      options.onSkip?.()
      return false
    }

    await this.write(filePath, content)
    options.onWrite?.()
    return true
  }
}
