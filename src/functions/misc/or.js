module.exports = (d) => {
		const data = d.util.aoiFunc(d);
		if (data.err) return d.error(data.err);

		const conditions = data.inside.splits.map(c => c.trim());

		function evaluateOR(conditions) {

			return conditions.reduce((prev, current) => {

				let result;

				const [left, comparator, right] = current.split(/(==|!=|>=|<=|>|<)/);

				if (comparator === '==') {
					result = left === right;
				} else if (comparator === '!=') {
					result = left !== right;
				} else if (comparator === '<=') {
					result = parseFloat(left) <= parseFloat(right);
				} else if (comparator === '>=') {
					result = parseFloat(left) >= parseFloat(right);
				} else if (comparator === '>') {
					result = parseFloat(left) > parseFloat(right);
				} else if (comparator === '<') {
					result = parseFloat(left) < parseFloat(right);
				}

				return prev || result;

			}, false);

		}

		data.result = evaluateOR(conditions);
		return {
			code: d.util.setCode(data)
		};
	}
