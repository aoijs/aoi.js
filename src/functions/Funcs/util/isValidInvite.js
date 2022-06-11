module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [link] = data.inside.splits;

    let res = await d.client.fetchInvite(link.addBrackets()).catch(e => undefined);
    data.result = res ? true : false;

    return {
        code: d.util.setCode(data)
    }
}