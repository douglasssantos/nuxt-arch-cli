import Handlebars from 'handlebars';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileReader } from '../utils/FileReader.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');
export class TemplateService {
    cache = new Map();
    constructor() {
        this.registerHelpers();
    }
    registerHelpers() {
        Handlebars.registerHelper('eq', (a, b) => a === b);
        Handlebars.registerHelper('or', (a, b) => a || b);
        Handlebars.registerHelper('and', (a, b) => a && b);
    }
    async render(templateName, context) {
        const compiled = await this.compile(templateName);
        return compiled(context);
    }
    async compile(templateName) {
        if (this.cache.has(templateName)) {
            return this.cache.get(templateName);
        }
        const templatePath = path.join(TEMPLATES_DIR, `${templateName}.hbs`);
        const source = await FileReader.read(templatePath);
        const compiled = Handlebars.compile(source, { noEscape: true });
        this.cache.set(templateName, compiled);
        return compiled;
    }
}
//# sourceMappingURL=TemplateService.js.map