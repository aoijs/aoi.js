import { Function } from "../structures/Function";
export declare class Compiler<T extends boolean = boolean> {
    #private;
    system: number;
    cacheName: string;
    functions: Function[];
    code: string;
    constructor(cacheName?: string);
    get alloc(): string;
    compile(str: string): this;
    reset(): this;
}
//# sourceMappingURL=Compiler.d.ts.map