export default class Condition {
    condition: string;
    nest: Condition[];
    parent: Condition | null;
    constructor(condition: string, parent?: Condition);
    solve(): string;
    solveAnd(condition: string): string;
    solveOr(condition: string): string;
    _solve(condition: string): string;
    add(part: string): void;
}
//# sourceMappingURL=Condition.d.ts.map