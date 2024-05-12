const Interpreter = require("../../core/interpreter.js");
const Util = require("../../classes/Util.js");
module.exports = async (message, client, db) => {
    if (client.aoiOptions) {
        const options = client.aoiOptions;
        if ((!options.respondToBots && (message.webhookId || message.author.bot)) || (options.guildOnly && message.channel.type === Util.channelTypes.DM)) return;
    }
    const commands = client.cmd?.default.V().filter((c) => c.name === "$alwaysExecute");
    if (!commands.length) return;
    commands.map(async (command) => {
        if (command.dmOnly && message.channel.type !== Util.channelTypes.DM) return;
        await Interpreter(client, message, message.content.split(" "), command, db);
    });
};
