module.exports = async d => {
    const data = d.util.aoiFunc(d);
		if(data.err) return d.error(data.err);

		const [name,...elements] = data.inside.splits;
		d.arrays[name] = elements;
		d.data.arrays = d.arrays;
		
		return {
			code: d.util.setCode(data),
			arrays: d.arrays,
			data:d.data,
		}
}