module.exports = (d) => {
    const data = d.util.aoiFunc(d);

    const [option] = data.inside.splits;

    try {
        data.result = eval(`d.data.awaitData?.${option.addBrackets()}`);
    } catch (e) {
        data.result = undefined;
    }
    return {
        code: d.util.setCode(data),
    };
};
