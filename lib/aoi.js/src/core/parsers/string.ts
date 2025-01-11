import { BundlerCustoms, TranspilerCustoms } from '@aoi.js/typings/enum.js';
import TextBlock from '../builders/TextBlock.js';

export function createStringAST(text: string) {
<<<<<<< HEAD

=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	let block = new TextBlock(0, true);
	let i = 0;
	let res = '';

<<<<<<< HEAD
	while (i <= text.length) {
=======
	while (i < text.length) {
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
		if (res.includes(TranspilerCustoms.FS)) {
			const child = new TextBlock(block.children.length, false, block);

			block.text = block.text.replace(TranspilerCustoms.FS, '');
			block.addText(child.parsed);
			block.addChild(child);

			block = child;
			block.addText(text[i]);

			res = text[i] ?? '';
		} else if (res.includes(TranspilerCustoms.FE)) {
			block.text = block.text.replace(TranspilerCustoms.FE, '');

			block = block.parent ?? block;
			block.addText(text[i] ?? '');

			res = text[i] ?? '';
		} else if (res.includes(TranspilerCustoms.MFS)) {
			const child = new TextBlock(block.children.length, false, block);

			block.text = block.text.replace(TranspilerCustoms.MFS, '');
			block.addText(child.parsed);
			block.addChild(child);

			block = child;
			block.addText(text[i]);

			res = text[i] ?? '';
		} else if (res.includes(TranspilerCustoms.MFE)) {
			block.text = block.text.replace(TranspilerCustoms.MFE, '');

			block = block.parent ?? block;
			block.addText(text[i] ?? '');

			res = text[i] ?? '';
		} else {
<<<<<<< HEAD
			if (i === text.length)  break;
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
			res += text[i] ?? '';
			block.addText(text[i] ?? '');
		}

		i++;
	}

	while (block.parent) {
		block = block.parent;
	}

	return block;
}

export function parseString(text: string) {
	const ast = createStringAST(text);
	return ast
		.parse()
		.replaceAll(BundlerCustoms.EJS, `\${${BundlerCustoms.EJS}`);
<<<<<<< HEAD
}
=======
}
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
