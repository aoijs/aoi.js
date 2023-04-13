export default class Block {
    position: number;
    isMain: boolean;
    parent?: Block;
    nest: Block[];
    text: string;
    constructor(position: number, isMain: boolean, parent?: Block);
    add(text: string): void;
    addBlock(block: Block): void;
    parse(): string;
    get parsed(): string;
}
//# sourceMappingURL=Block.d.ts.map