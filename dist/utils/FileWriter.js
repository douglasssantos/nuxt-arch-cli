import fs from 'fs-extra';
import path from 'node:path';
export class FileWriter {
    static async write(filePath, content) {
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, content, 'utf-8');
    }
    static async ensureDir(dirPath) {
        await fs.ensureDir(dirPath);
    }
    static async ensureDirs(dirs) {
        await Promise.all(dirs.map((d) => fs.ensureDir(d)));
    }
}
//# sourceMappingURL=FileWriter.js.map