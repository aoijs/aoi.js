export default class Block {
	position: number;
	isMain: boolean;
	parent?: Block;
	nest: Block[];
	text: string;
	constructor(position: number, isMain: boolean, parent?: Block) {
		this.position = position;
		this.isMain = isMain;
		this.parent = parent;
		this.nest = [];
		this.text = '';
	}

	add(text: string) {
		this.text += text;
	}

	addBlock(block: Block) {
		this.nest.push(block);
	}

	parse() {
		if (this.nest.length) {
			for (const block of this.nest) {
				const res = block.parse();
				this.text = this.text.replace(block.parsed, res);
			}

			return this.isMain ? `\`${this.text}\`` : `\${${this.text}}`;
		} else {
			return this.isMain ? `\`${this.text}\`` : `\${${this.text}}`;
		}
	}

	get parsed() {
		return `#NEST_POSITION_${this.position}#`;
	}
}
