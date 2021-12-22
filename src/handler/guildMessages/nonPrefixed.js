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
    const commands = client.cmd.default.allValues().filter((c) => c.nonPrefixed);
    if (!commands.length) return;
    for (const cmd of commands) {
        const bl = client.blacklist;
        if (bl.commands.includes(cmd.name.toLowerCase())) {
            if (bl.server.blacklist.has(message.guild?.id)) {
                continue;
            } else if (bl.channel.blacklist.has(message.channel.id)) {
                continue;
            } else if (
                bl.role.blacklist.find((x) => message.member?._roles.includes(x))
            ) {
                continue;
            } else if (
                bl.user.blacklist.has(
                    `${message.author.id}_${message.guild?.id || "dm"}`,
                )
            ) {
                continue;
            } else if (bl.globalUser.blacklist.has(message.author.id)) {
                continue;
            }
        }
        if (cmd.dmOnly && message.channel.type !== Util.channelTypes.Dm) continue;
        if (cmd.name.includes("$")) {
            cmd.name = (
                await Interpreter(
                    client,
                    message,
                    message.content.split(" "),
                    {name: "NameParser", code: cmd.name},
                    client.db,
                    true,
                )
            )?.code;
        }
        if (
            !message.content.toLowerCase().startsWith(cmd.name.toLowerCase()) &&
            !(Array.isArray(cmd.aliases)
                ? cmd.aliases.find((x) =>
                    message.content.toLowerCase().startsWith(x.toLowerCase()),
                )
                : cmd.aliases
                    ? message.content.toLowerCase().startsWith(cmd.aliases)
                    : undefined)
        )
            continue;
        await Interpreter(
            client,
            message,
            message.content.split(" "),
            cmd,
            client.db,
        );
    }
};
