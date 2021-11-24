const Interpreter = require("../../interpreter.js");
//const alwaysExecuteCommands = require("./alwaysExecuteCommands")
//const nonPrefixedCommands = require("./nonPrefixedCommands.js")
//const testInterpreter = require("../testInterpreter")

const CommandHandler = async (client, message, db) => {
    // console.log(message)
    if (!message) return;
    if (
        message?.channel?.type === "dm" &&
        client.messageEventOptions.guildOnly === false
    )
        return;
    if (message.author?.bot && client.messageEventOptions.respondToBots === false)
        return;
    const prefixes = [];
    for (const prefix of client.prefix) {
        if (prefix.startsWith("$")) {
            prefixes.push(
                await Interpreter(
                    client,
                    message,
                    message.content.split(" "),
                    {name: "prefix", code: prefix},
                    client.db,
                    true,
                ),
            );
        } else {
            prefixes.push(prefix);
        }
    }
    for (const prefix of prefixes) {
        const args = message.content.slice(prefix.length).trim().split(" ");
        const cmdName = args.shift().toLowerCase();
        if (message.content.toLowerCase().startsWith(prefix.toLowerCase())) {
            const cmd = client.cmd.default
                .filter(
                    (x) =>
                        x.name?.toLowerCase() === cmdName ||
                        (Array.isArray(x.aliases)
                            ? x.aliases?.find((x) => x.toLowerCase() === cmdName)
                            : x.aliases?.toLowerCase() === cmdName),
                )
                .allValues();
            for (const command of cmd) {
                if (command.asynchronous === true) {
                    await Interpreter(client, message, args, command);
                } else {
                    Interpreter(client, message, args, command);
                }
            }
        }
    }
};

module.exports = CommandHandler;
