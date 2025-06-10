/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [channelID = d.channel?.id] = data.inside.splits;

    const isTicket = await d.client.db.get("__aoijs_vars__", "ticketChannel", channelID);

    data.result = !!isTicket;

    return {
        code: d.util.setCode(data),
    };
};
