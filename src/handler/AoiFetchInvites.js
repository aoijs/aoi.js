const AoiInviteSystem = require("../classes/AoiInviteSystem.js");

module.exports = async (client) => {
    const cacheInviters = client.aoiOptions.fetchInvites?.cacheInviters || false;
    client.AoiInviteSystem = new AoiInviteSystem(client, cacheInviters);
    await client.AoiInviteSystem.fetchAll();
    if (cacheInviters) {
        await client.AoiInviteSystem.fetchInviters();
    }
};
