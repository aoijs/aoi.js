module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    data.result = d.author?.id
    return {
        code: d.util.setCode(data)
    }
};
