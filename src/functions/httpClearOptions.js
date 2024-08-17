module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    d.data.http = {};

    return {
        code: d.util.setCode(data),
        data: d.data
    }
}