export interface ResolvedName {
    pascal: string;
    camel: string;
    kebab: string;
    snake: string;
    upper: string;
    raw: string;
}
export declare class NameResolver {
    static resolve(name: string): ResolvedName;
}
//# sourceMappingURL=NameResolver.d.ts.map