module.exports = async (d) => {
	const data = d.util.openFunc(d);
	if (data.err) return d.error(data.err);

	const option = data.inside.inside;

	data.result = d.data.interaction.options.get(option.addBrackets());

	return {
		code: d.util.setCode(data),
	};
};
