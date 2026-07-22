export declare class LoggerService {
    private spinner;
    success(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    created(filePath: string): void;
    updated(filePath: string): void;
    skipped(filePath: string, reason?: string): void;
    startSpinner(message: string): void;
    stopSpinner(message?: string): void;
    failSpinner(message: string): void;
    newLine(): void;
    title(message: string): void;
}
//# sourceMappingURL=LoggerService.d.ts.map