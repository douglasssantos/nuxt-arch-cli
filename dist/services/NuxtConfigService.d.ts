export declare class NuxtConfigService {
    /**
     * Adds a layer path to the `extends` array in nuxt.config.ts.
     * Uses ts-morph AST manipulation — never regex.
     * Maintains alphabetical order.
     */
    addLayer(nuxtConfigPath: string, layerPath: string): Promise<boolean>;
    /**
     * Detects Nuxt version from package.json (v3 or v4).
     */
    detectNuxtVersion(cwd: string): Promise<'v3' | 'v4'>;
}
//# sourceMappingURL=NuxtConfigService.d.ts.map