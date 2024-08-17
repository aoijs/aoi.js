module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    data.result = d.data.http?.statusCode ?? Infinity;

    return {
        code: d.util.setCode(data),
        data: d.data
    }
}