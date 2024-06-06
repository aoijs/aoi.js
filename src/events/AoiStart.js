const Interpreter = require("../core/interpreter.js");

module.exports = async (client) => {
    if (client.aoiOptions.aoiLogs !== false) {
        await require("./AoiLogs.js")(client);
    }

    if (client.aoiOptions.aoiWarning !== false) {
        await require("./AoiWarning.js")(client);
    }

    if (client.aoiOptions.aoiAutoUpdate === true) {
        await require("./AoiAutoUpdate.js")(client);
    }

    if (!(client.aoiOptions.disableAoiDB === true) && client.db?.type === "aoi.db") {
        await require("./Custom/timeout.js")({ client, interpreter: Interpreter }, undefined, undefined, true);

        setInterval(async () => {
            await require("./Custom/handleResidueData.js")(client);
        }, 3.6e6);
    }

    if (client.cmd?.loop.size) {
        await require("./Custom/loop.js")(client);
    }
};
