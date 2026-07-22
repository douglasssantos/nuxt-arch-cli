import { FileReader } from '../utils/FileReader.js';
import { FileWriter } from '../utils/FileWriter.js';
export class FileService {
    async exists(filePath) {
        return FileReader.exists(filePath);
    }
    async read(filePath) {
        return FileReader.read(filePath);
    }
    async write(filePath, content) {
        await FileWriter.write(filePath, content);
    }
    async ensureDir(dirPath) {
        await FileWriter.ensureDir(dirPath);
    }
    async ensureDirs(dirs) {
        await FileWriter.ensureDirs(dirs);
    }
    async safeWrite(filePath, content, options) {
        const exists = await this.exists(filePath);
        if (exists && !options.force) {
            options.onSkip?.();
            return false;
        }
        await this.write(filePath, content);
        options.onWrite?.();
        return true;
    }
}
//# sourceMappingURL=FileService.js.map