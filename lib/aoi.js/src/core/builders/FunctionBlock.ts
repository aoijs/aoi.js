export default class TextBlock {
	position: number;
	isMain: boolean;
	parent?: TextBlock;
	children: TextBlock[];
	text: string;

	constructor(position: number, isMain: boolean, parent?: TextBlock) {
		this.position = position;
		this.isMain = isMain;
		this.parent = parent;
		this.children = [];
		this.text = '';
	}

	addText(text: string) {
		this.text += text;
	}

	addChild(child: TextBlock) {
		this.children.push(child);
	}

	parse() {
		for (const child of this.children) {
			const res = child.parse();
			this.text = this.text.replace(child.parsed, res);
		}

		return this.isMain ? `\`${this.text}\`` : `\${${this.text}}`;
	}

	get parsed() {
		return `#CHILD_POSITION_${this.position}#`;
	}
}