import { FileReader } from '../utils/FileReader.js';
import { FileWriter } from '../utils/FileWriter.js';
export class BarrelService {
    /**
     * Adds a named export to an index.ts barrel file.
     * Never duplicates existing exports.
     * Keeps exports sorted alphabetically.
     */
    async addExport(barrelPath, exportName) {
        const exportLine = `export * from './${exportName}'`;
        const exists = await FileReader.exists(barrelPath);
        let lines = [];
        if (exists) {
            const content = await FileReader.read(barrelPath);
            lines = content
                .split('\n')
                .map((l) => l.trim())
                .filter((l) => l.length > 0);
        }
        if (lines.includes(exportLine)) {
            return false;
        }
        lines.push(exportLine);
        lines.sort();
        await FileWriter.write(barrelPath, lines.join('\n') + '\n');
        return true;
    }
    /**
     * Ensures a barrel file exists, creating it if missing.
     */
    async ensureBarrel(barrelPath) {
        const exists = await FileReader.exists(barrelPath);
        if (!exists) {
            await FileWriter.write(barrelPath, '');
        }
    }
}
//# sourceMappingURL=BarrelService.js.map