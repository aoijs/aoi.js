module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [customID] = data.inside.splits;

    data.result = d.data.interaction.fields.getTextInputValue(customID.addBrackets());

    return {
        code: d.util.setCode(data)
    }
}