module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let [error] = data.inside.splits;

    const exists = await d.client.db.get(
        d.client.db.tables[0],
        `ticketChannel`,
        d.channel?.id
    );

    if (error) error = await d.util.errorParser(error, d);

    if (!exists) return d.aoiError.makeMessageError(d.client, d.channel, error, error.options, d);
    const channel = await d.message.channel.delete().catch((err) => {
        d.aoiError.makeMessageError(d.client, d.channel, error, error.options, d);
    });

    return {
        code: d.util.setCode(data)
    };
};