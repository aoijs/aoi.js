module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const option = data.inside.inside;

    data.result = d.data.interaction.options.get(option.addBrackets())?.value;

    return {
        code: d.util.setCode(data),
    };
};
