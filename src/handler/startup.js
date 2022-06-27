const Interpreter = require("../interpreter.js");
/*Copyright © 2021 @Akarui Development*/

module.exports = async (client) => {
    await require("./AoiWarning.js")(client);

    await require("./custom/timeout.js")(
        {client, interpreter: Interpreter},
        undefined,
        undefined,
        undefined,
        true,
    );
    await require("./custom/timeoutPulse.js")(
        {client, interpreter: Interpreter},
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
