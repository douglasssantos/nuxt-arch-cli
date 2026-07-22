export declare class PathResolver {
    private readonly cwd;
    private readonly layersDir;
    constructor(cwd?: string, layersDir?: string);
    layerRoot(layer: string): string;
    layerPath(layer: string, ...segments: string[]): string;
    nuxtConfig(): string;
    barrelFile(...segments: string[]): string;
    relative(from: string, to: string): string;
    resolve(...segments: string[]): string;
}
//# sourceMappingURL=PathResolver.d.ts.map