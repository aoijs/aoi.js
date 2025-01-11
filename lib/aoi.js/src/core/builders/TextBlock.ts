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

<<<<<<< HEAD
		return this.isMain ? `\`${this.text}\`` : this.parent?.isMain ? `\${${this.text}}` : this.text;
=======
		return this.isMain ? `\`${this.text}\`` : `\${${this.text}}`;
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	}

	get parsed() {
		return `#CHILD_POSITION_${this.position}#`;
	}
}