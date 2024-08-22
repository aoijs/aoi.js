module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    data.result = d.data.http?.statusCode;

    return {
        code: d.util.setCode(data),
        data: d.data
    }
}