module.exports = d => {
    const data = d.util.aoiFunc(d);

    let [index = 1] = data.inside.splits;

    index = Number(index) - 1;

    data.result = [...d.message.attachments.values()][index]?.url;

    return {
        code: d.util.setCode(data)
    }
}