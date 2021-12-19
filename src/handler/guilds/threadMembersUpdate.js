const Interpreter = require("../../interpreter.js");
module.exports = async (oldmCollection, newmCollection, client) => {
    const cmds = client.cmd.threadMembersUpdate.allValues();
    const data = {
        guild:
            oldmCollection.first().thread?.guild ||
            newmCollection.first().thread?.guild,
        channel: oldmCollection.first().thread || newmCollection.first().thread,
        client: client,
    };
    let chan;
    for (const cmd of cmds) {
        if (cmd?.channel?.includes("$")) {
            const id = await Interpreter(
                client,
                data,
                [],
                {name: "ChannelParser", code: cmd?.channel},
                client.db,
                true,
            );
            chan = client.channels.cache.get(id?.code);
        } else {
            chan = client.channels.cache.get(cmd.channel);
        }
        await Interpreter(
            client,
            data,
            [],
            cmd,
            client.db,
            false,
            chan?.id,
            {oldThreadMembers: oldmCollection, newThreadMembers: newmCollection},
            chan,
        );
    }
};
