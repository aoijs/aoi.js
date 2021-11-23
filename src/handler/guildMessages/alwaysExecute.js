const Interpreter = require("../../interpreter.js");
const Util = require("../../classes/Util.js");
module.exports = async (client, message, db) => {
    if (client.messageEventOptions) {
        const options = client.messageEventOptions;
        if (
            (!options.respondToBots && (message.webhookId || message.author.bot)) ||
            (options.guildOnly && message.channel.type === Util.channelTypes.Dm)
        )
            return;
    }
    const commands = client.cmd.default
        .allValues()
        .filter((c) => c.name === "$alwaysExecute");
    if (!commands.length) return;
    commands.map(async (command) => {
        const bl = client.blacklist;
        if (!command.whitelist) {
            if (bl.server.blacklist.has(message.guild?.id)) {
            } else if (bl.channel.blacklist.has(message.channel.id)) {
            } else if (
                bl.role.blacklist.find((x) => message.member?._roles.includes(x))
            ) {
            } else if (
                bl.user.blacklist.has(
                    `${message.author.id}_${message.guild?.id || "dm"}`,
                )
            ) {
            } else if (bl.globalUser.blacklist.has(message.author.id)) {
            }
        }
        if (command.dmOnly && message.channel.type !== Util.channelTypes.Dm) return;
        await Interpreter(client, message, message.content.split(" "), command, db);
    });
};
