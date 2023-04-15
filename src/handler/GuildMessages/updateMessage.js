const Interpreter = require("../../interpreter.js");
module.exports = async (oldm, newm, client) => {
    let chan;
    
    for (const cmd of client.cmd.messageUpdate.allValues()) {
        const id = cmd.channel.includes("$")
            ? (
                  await Interpreter(
                      client,
                      newm,
                      [],
                      { name: "channelParser", code: cmd.channel },
                      client.db,
                      true,
                  )
              )?.code
            : cmd.channel;

        let channel = client.channels.cache.get(id);
        if (!channel) channel = newm.channel;
        chan = channel;
        await Interpreter(
            client,
            newm,
            newm?.content?.split(" "),
            cmd,
            client.db,
            false,
            chan?.id,
            { oldm: oldm },
            chan,
        );
    }


                if (
                    client.aoiOptions.respondOnEdit &&
                    newm.content !== oldm.content &&
                    client.aoiOptions.respondOnEdit.time >
                        Date.now() - newm.createdTimestamp
                ) {
                    if (client.aoiOptions.respondOnEdit.commands) {
                        await require("./commands.js")(
                            newm,
                            client,
                            client.db,
                        );
                    }
                    if (client.aoiOptions.respondOnEdit.alwaysExecute) {
                        await require("./alwaysExecute.js")(
                            client,
                            newm,
                            client.db,
                        );
                    }
                    if (client.aoiOptions.respondOnEdit.nonPrefixed) {
                        await require("./nonPrefixed.js")(
                            client,
                            newm,
                            client.db,
                        );
                    }
                }
};
