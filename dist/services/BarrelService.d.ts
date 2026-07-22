export declare class BarrelService {
    /**
     * Adds a named export to an index.ts barrel file.
     * Never duplicates existing exports.
     * Keeps exports sorted alphabetically.
     */
    addExport(barrelPath: string, exportName: string): Promise<boolean>;
    /**
     * Ensures a barrel file exists, creating it if missing.
     */
    ensureBarrel(barrelPath: string): Promise<void>;
}
//# sourceMappingURL=BarrelService.d.ts.map