export interface TemplateContext {
    pascalName: string;
    camelName: string;
    kebabName: string;
    snakeName: string;
    upperName: string;
    layer?: string;
    [key: string]: unknown;
}
export declare class TemplateService {
    private readonly cache;
    constructor();
    private registerHelpers;
    render(templateName: string, context: TemplateContext): Promise<string>;
    private compile;
}
//# sourceMappingURL=TemplateService.d.ts.map