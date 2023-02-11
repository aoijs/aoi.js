const Interpreter = require("../interpreter.js");
/*Copyright © 2021 @Akarui Development*/

module.exports = async (client) => {
    if (client.aoiOptions.aoiLogs !== false) {
        console.log(
            "Initialized on \x1b[36maoi.js \x1b[32mv" +
            require("../../package.json").version +
            `\x1b[0m || \x1b[36m${client.user.tag}` +
            "\x1b[0m",
        );
        console.log(
            "Discord Support Server: https://discord.gg/HMUfMXDQsV",
        );
    }

    await require("./AoiWarning.js")(client);

    await require("./custom/timeout.js")(
        { client, interpreter: Interpreter },
        undefined,
        undefined,
        undefined,
        true,
    );
    await require("./custom/timeoutPulse.js")(
        { client, interpreter: Interpreter },
        undefined,
        undefined,
        undefined,
        undefined,
        true,
    );

    if (client.cmd.loop.size) {
        await require("./custom/loop.js")(client);
    }
};
