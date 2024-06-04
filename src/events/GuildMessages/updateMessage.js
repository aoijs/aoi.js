const Interpreter = require("../../core/interpreter.js");
module.exports = async (oldMessage, newMessage, client) => {
    let guildChannel;

    for (const cmd of client.cmd?.messageUpdate.V()) {
        const id = cmd.channel.includes("$") ? (await Interpreter(client, newMessage, [], { name: "channelParser", code: cmd.channel }, client.db, true))?.code : cmd.channel;

        let channel = client.channels.cache.get(id);
        if (!channel) channel = newMessage.channel;
        guildChannel = channel;
        await Interpreter(client, newMessage, newMessage?.content?.split(" "), cmd, client.db, false, guildChannel?.id, { oldMessage }, guildChannel);
    }

    if (client.aoiOptions.respondOnEdit && newMessage.content !== oldMessage.content && client.aoiOptions.respondOnEdit.time > Date.now() - newMessage.createdTimestamp) {
        if (client.aoiOptions.respondOnEdit.commands) {
            await require("./commands.js")(newMessage, client, client.db);
        }
        if (client.aoiOptions.respondOnEdit.alwaysExecute) {
            await require("./alwaysExecute.js")(client, newMessage, client.db);
        }
        if (client.aoiOptions.respondOnEdit.nonPrefixed) {
            await require("./nonPrefixed.js")(client, newMessage, client.db);
        }
    }
};
