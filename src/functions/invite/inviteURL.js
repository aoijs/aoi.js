module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    data.result = d.data.inviteData.url;

    return {
        code: d.util.setCode(data),
    };
};