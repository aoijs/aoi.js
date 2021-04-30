const interpreter = require("../interpreter");

module.exports = async (client, server, old) => {
  for (const command of client.music_start_commands.array()) {
    const data = {
      author: undefined,
      member: undefined,
      channel: server.text,
      guild: server.text.guild,
    }; //support

    const id = await interpreter(
      client,
      data,
      [],
      {
        channel: command.channel,
        code: command.channel,
      },
      undefined,
      true
    );

    const channel = client.channels.cache.get(`${id}`);

    if (!channel) return console.error(`channel with ID ${id} does not exist`);

    data.channel = channel;
    const msg = await interpreter(client, data, [], command, undefined);

    if (server.songs) {
      server.songs[0]["message"] = channel.messages.cache.last();
    } else {
      server.queue[0]["message"] = channel.messages.cache.last();
    }
  }
};
