import { Node } from "../../src/linked/node";
export declare class LinkedList {
    head: null | Node;
    size: number;
    __lastNode__?: Node;
    constructor();
    /**
     * @method add
     * @description adds an element to the list
     * @param element element to be added in the list
     */
    add(element: unknown): void;
    /**
     * removeLast
     */
    removeLast(): Node | null;
    /**
     * remove
     */
    remove(element: unknown): void;
    /**
     * insertAt
     */
    insertAt(index: number, element: unknown): void;
    /**
     * isEmpty
     */
    isEmpty(): boolean;
    /**
     * map
     */
    map<U>(func: (element: unknown, node: Node) => U): U[];
    /**
     * forEach
     */
    forEach<U>(func: (element: unknown, node: Node) => U): void;
}
//# sourceMappingURL=linkedList.d.ts.map