import Handlebars from 'handlebars'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FileReader } from '../utils/FileReader.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates')

export interface TemplateContext {
  pascalName: string
  camelName: string
  kebabName: string
  snakeName: string
  upperName: string
  layer?: string
  [key: string]: unknown
}

export class TemplateService {
  private readonly cache = new Map<string, HandlebarsTemplateDelegate>()

  constructor() {
    this.registerHelpers()
  }

  private registerHelpers(): void {
    Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b)
    Handlebars.registerHelper('or', (a: unknown, b: unknown) => a || b)
    Handlebars.registerHelper('and', (a: unknown, b: unknown) => a && b)
  }

  async render(templateName: string, context: TemplateContext): Promise<string> {
    const compiled = await this.compile(templateName)
    return compiled(context)
  }

  private async compile(templateName: string): Promise<HandlebarsTemplateDelegate> {
    if (this.cache.has(templateName)) {
      return this.cache.get(templateName)!
    }

    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.hbs`)
    const source = await FileReader.read(templatePath)
    const compiled = Handlebars.compile(source, { noEscape: true })
    this.cache.set(templateName, compiled)
    return compiled
  }
}
