export declare class SuperSet<T = unknown> extends Set<T> {
    constructor(prototype: Iterable<T>);
    squash(...values: T[]): void;
    get(value: number): any;
    array(): T[];
    map(func: (value: T, index: number, array: T[]) => unknown): unknown[];
    isSubset(set: Iterable<T> | ArrayLike<T>): boolean;
    isParent(set: Iterable<T> | ArrayLike<T>): boolean;
    filter(data: (value: T, index: number, array: T[]) => value is T): SuperSet<T>;
    find(data: (this: void, value: T, index: number, obj: T[]) => value is T): T | undefined;
    union(...sets: (SuperSet<T> | Set<T>)[]): Set<T> | undefined;
    intersection(...sets: (SuperSet<T> | Set<T>)[]): Set<T> | undefined;
    difference(setA: SuperSet<T> | Set<T>, setB: SuperSet<T> | Set<T>): SuperSet<T> | Set<T>;
    equal(set: SuperSet<T> | Set<T>): boolean;
    sort(func: (a: T, b: T) => number): SuperSet<T>;
}
//# sourceMappingURL=superset.d.ts.map