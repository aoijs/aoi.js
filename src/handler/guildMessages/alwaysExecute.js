const Interpreter = require("../../interpreter.js");
const Util = require("../../classes/Util.js");
module.exports = async ( message,client, db) => {
    if (client.messageEventOptions) {
        const options = client.messageEventOptions;
        if (
            (!options.respondToBots &&
                (message.webhookId || message.author.bot)) ||
            (options.guildOnly && message.channel.type === Util.channelTypes.Dm)
        )
            return;
    }
    const commands = client.cmd.default
        .allValues()
        .filter((c) => c.name === "$alwaysExecute");
    if (!commands.length) return;
    commands.map(async (command) => {
        if (command.dmOnly && message.channel.type !== Util.channelTypes.Dm)
            return;
        await Interpreter(
            client,
            message,
            message.content.split(" "),
            command,
            db,
        );
    });
};
