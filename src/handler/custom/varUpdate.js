const Interpreter = require("../../interpreter.js");
module.exports = async (olddata, newdata, client) => {
    let chan;
    const d = {
        client: client,
        guild: newdata.guild,
        channel: newdata.channel,
        message: newdata.message,
        author: newdata.author,
    };
    const cmds = client.cmd.variableUpdate.allValues();
    for (const cmd of cmds) {
        const id = cmd.channel?.includes("$")
            ? (
                  await Interpreter(
                      client,
                      d,
                      [],
                      { name: "ChannelParser", code: cmd.channel },
                      client.db,
                      true,
                  )
              )?.code
            : cmd.channel;

        chan = client.channels.cache.get(id?.code);

        await Interpreter(
            client,
            d,
            [],
            cmd,
            client.db,
            false,
            chan?.id,
            { newv: newdata, oldv: olddata },
            chan,
        );
    }
};
