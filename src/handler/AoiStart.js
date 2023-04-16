const Interpreter = require("../interpreter.js");

module.exports = async (client) => {
    if (client.aoiOptions.aoiLogs !== false) {
        console.warn('\x1b[36maoi.js:\x1B[0m Initializing on \x1B[32mv' + require('../../package.json').version + '\x1B[0m')
        console.warn(
            '\x1b[33mSupport:\x1B[0m Discord Server: https://discord.gg/HMUfMXDQsV')
    }

    if (client.aoiOptions.aoiWarning !== false) {
        await require("./AoiWarning.js")(client);
    }

    if (client.aoiOptions.AoiAutoUpdate === true) {
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
