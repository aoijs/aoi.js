const { AoiError } = require("../../index.js");
const Interpreter = require("../../interpreter.js");

module.exports = async (track, channel, client, voice) => {
  const cmds = voice.cmds.trackStart.allValues();
  for (const cmd of cmds) {
    const id = cmd.channel.includes("$")
      ? (
          await Interpreter(
            client,
            {},
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
        channel: channel,
        guild: channel.guild,
      },
      [],
      cmd,
      client.db,
      false,
      undefined,
      {
        track: track,
      },
      channel,
    );
  }
};
