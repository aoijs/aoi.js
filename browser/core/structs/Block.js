export default class Block {
    position;
    isMain;
    parent;
    nest;
    text;
    constructor(position, isMain, parent) {
        this.position = position;
        this.isMain = isMain;
        this.parent = parent;
        this.nest = [];
        this.text = "";
    }
    add(text) {
        this.text += text;
    }
    addBlock(block) {
        this.nest.push(block);
    }
    parse() {
        if (this.nest.length) {
            for (const block of this.nest) {
                const res = block.parse();
                this.text = this.text.replace(block.parsed, res);
            }
            return this.isMain ? `\`${this.text}\`` : `\${${this.text}}`;
        }
        else {
            return this.isMain ? `\`${this.text}\`` : `\${${this.text}}`;
        }
    }
    get parsed() {
        return `#NEST_POSITION_${this.position}#`;
    }
}
//# sourceMappingURL=Block.js.map