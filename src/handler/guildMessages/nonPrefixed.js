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
        .filter((c) => c.nonPrefixed);
    if (!commands.length) return;
    for (const cmd of commands) {
        if (cmd.dmOnly && message.channel.type !== Util.channelTypes.Dm)
            continue;
        if (cmd.name.includes("$")) {
            cmd.name = (
                await Interpreter(
                    client,
                    message,
                    message.content.split(" "),
                    { name: "NameParser", code: cmd.name },
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
