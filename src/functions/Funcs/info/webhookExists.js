module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [id] = data.inside.splits;

    const webhook = await d.client.fetchWebhook(id).catch(err => {
    });

    data.result = webhook ? true : false;

    return {
        code: d.util.setCode(data)
    }
}