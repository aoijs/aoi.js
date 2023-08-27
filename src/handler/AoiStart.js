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

    await require("./Custom/timeout.js")(
        {client, interpreter: Interpreter},
        undefined,
        undefined,
        undefined,
        true,
    );
    await require("./Custom/timeoutPulse.js")(
        {client, interpreter: Interpreter},
        undefined,
        undefined,
        undefined,
        undefined,
        true,
    );

    if (client.cmd.loop.size) {
        await require("./Custom/loop.js")(client);
    }
};