export declare class FileService {
    exists(filePath: string): Promise<boolean>;
    read(filePath: string): Promise<string>;
    write(filePath: string, content: string): Promise<void>;
    ensureDir(dirPath: string): Promise<void>;
    ensureDirs(dirs: string[]): Promise<void>;
    safeWrite(filePath: string, content: string, options: {
        force?: boolean;
        onSkip?: () => void;
        onWrite?: () => void;
    }): Promise<boolean>;
}
//# sourceMappingURL=FileService.d.ts.map