import fs from 'fs-extra';
export class FileReader {
    static async read(filePath) {
        return fs.readFile(filePath, 'utf-8');
    }
    static async exists(filePath) {
        return fs.pathExists(filePath);
    }
    static async readJson(filePath) {
        return fs.readJson(filePath);
    }
}
//# sourceMappingURL=FileReader.js.map