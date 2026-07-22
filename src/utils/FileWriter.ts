import fs from 'fs-extra'
import path from 'node:path'

export class FileWriter {
  static async write(filePath: string, content: string): Promise<void> {
    await fs.ensureDir(path.dirname(filePath))
    await fs.writeFile(filePath, content, 'utf-8')
  }

  static async ensureDir(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath)
  }

  static async ensureDirs(dirs: string[]): Promise<void> {
    await Promise.all(dirs.map((d) => fs.ensureDir(d)))
  }
}
