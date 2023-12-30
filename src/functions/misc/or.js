module.exports = (d) => {
		const data = d.util.aoiFunc(d);
		if (data.err) return d.error(data.err);

		let conditions = data.inside.splits;

		function evaluateOR(conditions) {
			return conditions.reduce((prev, current) => {
				let result;
				const [left, comparator, right] = current.split(/(==|!=|>|<)/);
        
				if (comparator === '==') {
					result = left === right;
				} else if (comparator === '!=') {
					result = left !== right;
				} else if (comparator === '>') {
					result = parseInt(left) > parseInt(right);
				} else if (comparator === '<') {
					result = parseInt(left) < parseInt(right);
				}

				return prev || result;
			}, false);
		}

		data.result = evaluateOR(conditions);
		return {
			code: d.util.setCode(data)
		};
	}
