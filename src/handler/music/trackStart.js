const { Track } = require("@akarui/aoi.music/lib");
const { TextChannel } = require("discord.js");
const Client = require("../../classes/AoiClient.js");
const Voice = require("../../classes/Voice.js");
const { AoiError } = require("../../index.js");
const Interpreter = require("../../interpreter.js");
/**
 * @param  {Track} track
 * @param  {TextChannel} Channel
 * @param  {Client} client
 * @param  {Voice} voice
 */
module.exports = async (track, Channel, client, voice) => {
  const cmds = voice.cmd.trackStart.allValues();
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

    const interpreterObj = await Interpreter(
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
      false,
      false,
      true,
    );
    if (voice.pruneMusic) {
      voice.prunes.set(Channel.id, interpreterObj?.id);
    }
  }
};
