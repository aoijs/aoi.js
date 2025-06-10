/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let [error] = data.inside.splits;

    if (error) error = await d.util.errorParser(error, d);

    const exists = await d.client.db.get("__aoijs_vars__", `ticketChannel`, d.channel?.id);

    if (!exists) {
        await d.aoiError.makeMessageError(d.client, d.channel, error.data ?? error, error.options);

        return {
            code: d.util.setCode(data)
        };
    }
    
    await d.message.channel.delete().catch(async () => {
        if (error) {
            await d.aoiError.makeMessageError(
                d.client,
                d.channel,
                error.data ?? error,
                error.options,
            );
        }
    });

    await d.client.db.delete("__aoijs_vars__", `ticketChannel`, d.channel.id);

    return {
        code: d.util.setCode(data)
    };
};