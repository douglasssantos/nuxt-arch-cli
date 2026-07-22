import fs from 'fs-extra'

export class FileReader {
  static async read(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8')
  }

  static async exists(filePath: string): Promise<boolean> {
    return fs.pathExists(filePath)
  }

  static async readJson<T>(filePath: string): Promise<T> {
    return fs.readJson(filePath) as Promise<T>
  }
}
