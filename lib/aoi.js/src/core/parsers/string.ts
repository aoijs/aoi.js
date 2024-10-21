import { BundlerCustoms, TranspilerCustoms } from '@aoi.js/typings/enum.js';
import TextBlock from '../builders/TextBlock.js';

export function createStringAST(text: string) {
	let block = new TextBlock(0, true);
	let i = 0;
	let res = '';

	while (i < text.length) {
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
}
