import { inspect } from 'util';
import { parseData } from '../../util/transpilerHelpers.js';
import { parseString } from '../parsers/stringParser.js';
import { BundlerCustoms } from '../../typings/enums.js';
const operators = ['===', '!==', '==', '!=', '>', '<', '>=', '<='];

export default class Condition {
	condition: string;
	nest: Condition[];
	parent: Condition | undefined;
	constructor(condition: string, parent?: Condition) {
		this.condition = condition;
		this.nest = [];
		this.parent = parent ?? null;
	}

	solve() {
		if (this.nest.length) {
			return this._solve(this.condition);
		} else return this.solveAnd(this.condition);
	}

	solveAnd(condition: string) {
		const conditions = condition.split('&&');
		const res = [];
		for (const c of conditions) {
			if (condition.includes('||')) {
				res.push(this.solveOr(c));
			} else {
				res.push(this._solve(c));
			}
		}

		return res.join('&&');
	}

	solveOr(condition: string) {
		const conditions = condition.split('||');
		const res = [];
		for (const c of conditions) {
			res.push(this._solve(c));
		}

		return res.join('||');
	}

	_solve(condition: string): string {
		condition = condition
			.replaceAll('#SMOOTH_BRACKET_LEFT#', '(')
			.replaceAll('#SMOOTH_BRACKET_RIGHT#', ')');
		if (this.nest.length) {
			for (const c of this.nest) {
				const solvedData = c.solve();
				condition = condition.replace('#CONDITION#', `(${solvedData})`);
			}

			return condition;
		} else {
			const op = operators.find((o) => condition.includes(o));
			let res;
			if (op) {
				const [left, right] = condition.split(op);
				let leftData, rightData;
				if (left.trim().split(' ').length === 1) {
					leftData = parseData(left.trim());
					if (typeof leftData === 'object') {
						try {
							leftData = JSON.stringify(leftData);
						} catch {
							leftData = inspect(leftData);
						}
					} else if (typeof leftData === 'string') {
						if (
							!((leftData.startsWith('#FUNCTION_START#') &&
                                leftData.endsWith('#FUNCTION_END#')) ||
                            leftData.startsWith('__$DISCORD_DATA$__') || leftData.trim() === BundlerCustoms.EJS )
						) {
							leftData = parseString(leftData);
							if (
								typeof parseData(
									leftData.substring(1, leftData.length - 1),
								) !== 'string'
							) {
								leftData = parseData(
									leftData.substring(1, leftData.length - 1),
								);
							}
						}
					} else if ( typeof leftData === 'bigint' ) {
						leftData = leftData.toString() + 'n';
					}
				} else {
					leftData = parseString(left.trim());
				}

				if (right.trim().split(' ').length === 1) {
					rightData = parseData(right.trim());
					if (typeof rightData === 'object') {
						try {
							rightData = JSON.stringify(rightData);
						} catch {
							rightData = inspect(rightData);
						}
					} else if (typeof rightData === 'string') {
						if (
							!((rightData.startsWith('#FUNCTION_START#') &&
                                rightData.endsWith('#FUNCTION_END#')) ||
                            (rightData.startsWith('__$') &&
                                rightData.includes('$__')) ||
                            rightData.startsWith('__$DISCORD_DATA$__') || rightData.trim() === BundlerCustoms.EJS)
						) {
							rightData = parseString(rightData);
							if (
								typeof parseData(
									rightData.substring(
										1,
										rightData.length - 1,
									),
								) !== 'string'
							) {
								rightData = parseData(
									rightData.substring(
										1,
										rightData.length - 1,
									),
								);
							}
						}
					} else if (typeof rightData === 'bigint') {
						rightData = rightData.toString() + 'n';
					}

					res = `${leftData}${op}${rightData}`;
				} else {
					rightData = parseString(right.trim());
					res = `${leftData}${op}${rightData}`;
				}
			} else {
				res = parseData(condition);
				if (
					typeof res === 'string' &&
                    (!res.endsWith('#FUNCTION_END#') ||
                        res.trim().split(' ').length > 1) &&
                    !res.startsWith('#FUNCTION_START#') && res.trim() !== BundlerCustoms.EJS
				) {
					res = parseString(res);
				}
			}

			return res;
		}
	}

	add(part: string) {
		this.condition += part;
	}
}
