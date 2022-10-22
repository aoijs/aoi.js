const { AoiError } = require("../../index.js");
const Interpreter = require("../../interpreter.js");

module.exports = async (Channel, client, voice) => {
  const cmds = voice.cmd.trackResume.allValues();
  for (const cmd of cmds) {
    const id = cmd.channel.includes("$")
      ? (
          await Interpreter(
            client,
            {
              channel: Channel,
              guild: Channel.guild,
            },
            [],
            {
              name: "channelParser",
              code: cmd.channel,
            },
            client.db,
            true,
          )
        )?.code
      : cmd.channel;
    const channel = client.channels.cache.get(id);
    if (!channel)
      return AoiError.CommandError(
        cmd,
        "channel",
        cmd.name,
        cmds.findIndex((c) => !c.channel),
      );

    await Interpreter(
      client,
      {
        channel: Channel,
        guild: Channel.guild,
      },
      [],
      cmd,
      client.db,
      false,
      undefined,
      {},
      channel,
    );
  }
};
