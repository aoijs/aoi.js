import { TranspilerCustoms } from '@aoi.js/typings/enum.js';
import Condition, { OPERATORS } from '../builders/Condition.js';

export function _countSmoothBrackets(condition: string) {
	const start = condition.split('(').length - 1;
	const end = condition.split(')').length - 1;

	return {
		start,
		end,
	};
}

export function _areSmoothBracketsBalanced(condition: string) {
	const { start, end } = _countSmoothBrackets(condition);

	return start === end;
}

export function parseCondition(condition: string) {
	if (condition.includes(TranspilerCustoms.FS)) {
		const matches = condition.match(
<<<<<<< HEAD
			/((#FUNCTION_START#([$a-z.0-9\s?(){}[\]._:'"`;=><,!\-`@/]|\n)+#FUNCTION_END#)|(__\$[a-z_?.()]+\$__))/gim,
=======
			/((#FUNCTION_START#([$a-z.0-9\s?(){}[\]._:'"`;=><,!-]|\n)+#FUNCTION_END#)|(__\$[a-z_?.()]+\$__))/gim,
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
		);

		if (matches) {
			for (const match of matches) {
				const updated = match
					.replaceAll('(', TranspilerCustoms.SBL)
					.replaceAll(')', TranspilerCustoms.SBR);

				condition = condition.replace(match, updated);
			}
		}
	}

	let i = 0,
		starter = new Condition('');

	while (i < condition.length) {
		const char = condition[i];

		if (char === '(') {
			const child = new Condition('', starter);
			starter.add('#CONDITION#');
			starter.addChild(child);
			starter = child;
		} else if (char === ')') {
			if (starter.parent) {
				starter = starter.parent;
			} else {
				break;
			}
		} else {
			starter.add(char);
		}

		i++;
	}

	return starter;
}
