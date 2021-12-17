module.exports = async d => {
    const data = d.util.openFunc(d);

    const [ticketId] = data.inside.splits;
    data.result = (await d.client.db.get(d.client.db.tables[0], 'ticketChannel', ticketId)) ? true : false
    return {
        code: d.util.setCode(data)
    }
}