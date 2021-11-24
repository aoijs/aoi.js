const {User, Team} = require("discord.js");
const Interpreter = require("../interpreter.js");
const {default: axios} = require("axios");
const json = require("../../package.json");

module.exports = async (client) => {
    const app = await client.application.fetch();
    if (app.owner instanceof Team) {
        client.aoiOptions.Owner = app.owner.members.map((x) => x.id);
    } else {
        client.aoiOptions.Owner = [app.owner.id];
    }

    require("./custom/timeout.js")(
        {client, interpreter: Interpreter},
        undefined,
        undefined,
        undefined,
        true,
    );
    require("./custom/timeoutPulse.js")(
        {client, interpreter: Interpreter},
        undefined,
        undefined,
        undefined,
        undefined,
        true,
    );

    if (client.cmd.loop.size) {
        require("./custom/loop.js")(client);
    }

    const res = await axios.get("https://api.leref.ga/package/version");
    if (json.version !== res.data.version) {
        console.warn(
            "\x1b[31maoi.js warning: \u001b[33mAvailable version v" +
            res.data.version +
            " ready to install.\u001b[0m",
        );
    }
};
