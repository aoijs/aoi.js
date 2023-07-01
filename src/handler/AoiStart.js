const Interpreter = require("../interpreter.js");

module.exports = async (client) => {
    if (client.aoiOptions.aoiLogs !== false) {
        const version = require('../../package.json').version;
        const line = '═\x1b[36m═\x1b[0m'.repeat(18);
        const topBorder = `╔${line}╗`;

        console.log(`\n\x1b[36m${topBorder}\x1b[0m`);
        console.log(`\n\x1b[1mInitializing on \x1b[36maoi.js\x1b[0m`);
        console.log(`\x1b[1mInstalled on \x1b[32mv${version}\x1b[0m`);
        console.log(`\x1b[1mDiscord Server: \x1b[32mhttps://discord.gg/HMUfMXDQsV\x1b[0m`);
        console.log(`\n\x1b[36m╚${line}╝\x1b[0m`);
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
