const {
    AoijsAPI,
    DbdTsDb,
    CustomDb,
    Promisify,
} = require("../../../classes/Database");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [channelId = d.channel?.id] = data.inside.splits;

    let isTicket = await d.client.db.get(
        d.client.db.tables[0],
        "ticketChannel",
        channelId,
    );

    data.result = !!isTicket;

    return {
        code: d.util.setCode(data),
    };
};
