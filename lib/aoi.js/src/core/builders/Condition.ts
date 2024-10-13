import { inspect } from 'util';
import { parseData } from '@aoi.js/utils/Helpers/core.js';
import { parseString } from '../parsers/string.js';
import { BundlerCustoms, TranspilerCustoms } from '@aoi.js/typings/enum.js';

export const OPERATORS = ['==', '!=', '>=', '<=', '>', '<', '===', '!=='] as const;

export default class Condition {
	condition: string;
	children: Condition[] = [];
	parent: Condition | undefined;

	constructor(condition: string, parent?: Condition) {
		this.condition = condition;
		this.parent = parent;
	}

	_handlePart(part: string) {
		let result;
		if (part.split(' ').length === 1) {
			result = parseData(part);

			if (typeof result === 'object') {
				try {
					result = JSON.stringify(result);
				} catch {
					result = inspect(result, { depth: null });
				}
			} else if (typeof result === 'string') {
				if (
					!(
						(result.startsWith(TranspilerCustoms.FS) &&
							result.endsWith(TranspilerCustoms.FE)) ||
						result.startsWith('__$DISCORD_DATA$__') ||
						result.trim() === (BundlerCustoms.EJS as string)
					)
				) {
					result = parseString(result);

					if (typeof parseData(result.slice(1, -1)) !== 'string') {
						result = parseData(result.slice(1, -1));
					}
				}
			} else if (typeof result === 'bigint') {
				result = result.toString() + 'n';
			}
		} else {
			result = parseString(part);
		}

		return result;
	}

	_handleConditionWithOperator(condition: string, op: string) {
		let [left, right] = condition.split(op);
		left = left.trim();
		right = right.trim();

		const leftResult = this._handlePart(left) as string;
		const rightResult = this._handlePart(right) as string;

		return `${leftResult}${op}${rightResult}`;
	}

	_solve(condition: string) {
		condition = condition
			.replaceAll(TranspilerCustoms.SBL, '(')
			.replaceAll(TranspilerCustoms.SBR, ')');

		if (this.children.length) {
			for (const child of this.children) {
				const solved = child.solve();
				condition = condition.replace('#CONDITION#', `(${solved})`);
			}

			return condition;
		}

		const op = OPERATORS.find((op) => condition.includes(op));
		let result;

		if (op) {
			result = this._handleConditionWithOperator(condition, op);
		} else {
			result = parseData(condition);

			if (
				typeof result === 'string' &&
				(!result.endsWith(TranspilerCustoms.FE) ||
					result.trim().split(' ').length > 1) &&
				!result.startsWith(TranspilerCustoms.FS) &&
				result.trim() !== (BundlerCustoms.EJS as string)
			) {
				result = parseString(result);
			}
		}

		return result as string;
	}

	_solveOr(condition: string) {
		const subConditions = condition.split('||');
		const results = [];

		for (const subCondition of subConditions) {
			results.push(this._solve(subCondition));
		}

		return results.join(' || ');
	}

	_solveAnd(condition: string) {
		const subConditions = condition.split('&&');
		const results = [];

		for (const subCondition of subConditions) {
			if (subCondition.includes('||')) {
				results.push(this._solveOr(subCondition));
			} else {
				results.push(this._solve(subCondition));
			}
		}

		return results.join(' && ');
	}

	solve() {
		if (this.children.length) {
			return this._solve(this.condition);
		}

		return this._solveAnd(this.condition);
	}

	add(part: string) {
		this.condition += part;
	}

	addChild(child: Condition) {
		this.children.push(child);
	}
}
