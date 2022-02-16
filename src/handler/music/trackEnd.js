const { AoiError } = require("../../index.js");
const Interpreter = require("../../interpreter.js");

module.exports = async (track, Channel, client, voice) => {
  if (voice.pruneMusic) {
    const msgId = voice.prunes.get(Channel.id);
    //console.log({ msgId });
    if (!msgId) {
    } else {
      const msg = await Channel.messages.fetch(msgId).catch((_) => undefined);
      //console.log({ msg });
      if (!msg) {
      } else msg.delete().catch((e) => undefined);
    }
  }
  const cmds = voice.cmd.trackEnd.allValues();
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
      {
        track: track,
      },
      channel,
    );
  }
};
