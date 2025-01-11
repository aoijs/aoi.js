import { TranspilerCustoms } from '@aoi.js/typings/enum.js';
import type { IFnBlock } from '@aoi.js/typings/interface.js';

export function createFunctionBlockAst(text: string) {

	let block: IFnBlock = {
		text: '',
		children: [],
		parent: undefined,
	};
	let i = 0;
	let res = '';

	while (i <= text.length) {
		if (res.includes(TranspilerCustoms.FS)) {
			const child = {
				text: '',
				children: [],
				parent: block,
			};

			block.text = block.text.replace(TranspilerCustoms.FS, '');
			block.text += '###FUNCTION###';
			block.children.push(child);

			block = child;
			block.text += TranspilerCustoms.FS + (text[i] ?? '');

			res = text[i] ?? '';
		} else if (res.includes(TranspilerCustoms.FE)) {
			// block.text = block.text.replace(TranspilerCustoms.FE, '');

			block = block.parent ?? block;
			block.text += (text[i] ?? '');

			res = text[i] ?? '';
		} else {
			if (i === text.length)  break;
			res += text[i] ?? '';
			block.text += (text[i] ?? '');
		}

		i++;
	}

	while (block.parent) {
		block = block.parent;
	}

	return block;
}

export function recursiveReplace(block: IFnBlock) {
	if (block.children.length) {
		
		for (let i = block.children.length - 1; i >= 0; i--) {
			const child = block.children[i];
			const text = recursiveReplace(child);
			block.text = block.text.replace('###FUNCTION###', text);
		}
	}

	return block.text;
}

export function parseFnBlock(text: string) {
	const ast = createFunctionBlockAst(text);
	return recursiveReplace(ast);
}
