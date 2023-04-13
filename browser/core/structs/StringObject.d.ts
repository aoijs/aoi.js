export default class StringObject {
    parent: StringObject | undefined;
    children: StringObject[];
    start: "{" | "[";
    end?: "}" | "]";
    keys: string[];
    values: string[];
    name: number;
    constructor(start: "{" | "[", parent?: StringObject);
    addKey(text: string): void;
    addValue(text: string): void;
    addEnd(text: "}" | "]"): void;
    pushChild(child: StringObject): void;
    solve(): string;
}
//# sourceMappingURL=StringObject.d.ts.map