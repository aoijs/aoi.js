const {Team} = require("discord.js");
const Interpreter = require("../interpreter.js");

module.exports = async (client) => {
    const app = await client.application.fetch();
    if (app.owner instanceof Team) {
        client.aoiOptions.Owner = app.owner.members.map((x) => x.id);
    } else {
        client.aoiOptions.Owner = [app.owner.id];
    }

    await require("./aoiWarning.js")(client);

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
