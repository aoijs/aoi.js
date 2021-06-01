const interpreter = require("../interpreter");

module.exports = async (client, emoji) => {
  for (const command of client.emoji_create_commands.array()) {
    const data = {
      guild: emoji.guild,
    };

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

    const channel = client.channels.cache.get(id);

    //if (!channel) return console.error(`channel with ID ${id} does not exist`)

    data.channel = channel;

    await interpreter(
      client,
      data,
      [],
      command,
      undefined,
      undefined,
      undefined,
      {
        old_emoji: emoji,
        new_emoji: emoji,
      }
    );
  }
};
