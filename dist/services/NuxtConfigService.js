import { Project, SyntaxKind } from 'ts-morph';
import path from 'node:path';
import { FileReader } from '../utils/FileReader.js';
export class NuxtConfigService {
    /**
     * Adds a layer path to the `extends` array in nuxt.config.ts.
     * Uses ts-morph AST manipulation — never regex.
     * Maintains alphabetical order.
     */
    async addLayer(nuxtConfigPath, layerPath) {
        const exists = await FileReader.exists(nuxtConfigPath);
        if (!exists) {
            throw new Error(`nuxt.config.ts not found at: ${nuxtConfigPath}`);
        }
        const project = new Project({ skipFileDependencyResolution: true });
        const sourceFile = project.addSourceFileAtPath(nuxtConfigPath);
        // Find the default export call expression: defineNuxtConfig({...})
        let extendsArray = [];
        let extendsNode = null;
        // Walk through all call expressions to find defineNuxtConfig
        const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
        for (const call of callExpressions) {
            const expr = call.getExpression();
            if (expr.getText() !== 'defineNuxtConfig')
                continue;
            const args = call.getArguments();
            if (args.length === 0)
                continue;
            const config = args[0];
            if (config.getKind() !== SyntaxKind.ObjectLiteralExpression)
                continue;
            const obj = config.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
            const extendsProp = obj.getProperty('extends');
            if (extendsProp) {
                const initializer = extendsProp
                    .asKindOrThrow(SyntaxKind.PropertyAssignment)
                    .getInitializer();
                if (initializer?.getKind() === SyntaxKind.ArrayLiteralExpression) {
                    extendsNode = initializer.asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
                    extendsArray = extendsNode.getElements().map((el) => {
                        const text = el.getText();
                        return text.replace(/['"]/g, '');
                    });
                }
            }
            else {
                // Add extends property
                obj.addPropertyAssignment({ name: 'extends', initializer: '[]' });
                await project.save();
                // Re-read to get the array node
                return this.addLayer(nuxtConfigPath, layerPath);
            }
            break;
        }
        if (!extendsNode) {
            throw new Error('Could not find defineNuxtConfig or extends array in nuxt.config.ts. ' +
                'Ensure your config uses defineNuxtConfig({...}).');
        }
        if (extendsArray.includes(layerPath)) {
            return false;
        }
        extendsArray.push(layerPath);
        extendsArray.sort();
        const formatted = extendsArray.map((p) => `'${p}'`).join(', ');
        extendsNode.replaceWithText(`[${formatted}]`);
        await project.save();
        return true;
    }
    /**
     * Detects Nuxt version from package.json (v3 or v4).
     */
    async detectNuxtVersion(cwd) {
        try {
            const pkgPath = path.join(cwd, 'package.json');
            const pkg = await FileReader.read(pkgPath);
            const parsed = JSON.parse(pkg);
            const nuxtVersion = parsed.dependencies?.nuxt ?? '';
            if (nuxtVersion.startsWith('^4') || nuxtVersion.startsWith('4')) {
                return 'v4';
            }
        }
        catch {
            // ignore
        }
        return 'v3';
    }
}
//# sourceMappingURL=NuxtConfigService.js.map