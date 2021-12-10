const {Team} = require("discord.js");
const Interpreter = require("../interpreter.js");
const {default: axios} = require("axios");
const json = require("../../package.json");

module.exports = async (client) => {
    const res = await axios.get("https://api.leref.ga/package/version");
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
    if (json.version !== res.data.version) {
        await require("./aoiWarning.js")(client);
    }

};
