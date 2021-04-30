const interpreter = require("../interpreter.js");

module.exports = async (client, olds, news) => {
  for (const command of client.voice_state_update_commands.array()) {
    const data = {
      author: news.member ? news.member.author : {},
      member: news.member,
      guild: news.guild,
    };

    const id = command.channel.includes("$")
      ? await interpreter(
          client,
          data,
          [],
          {
            channel: command.channel,
            code: command.channel,
          },
          undefined,
          true
        )
      : command.channel;

    const channel = news.guild.channels.cache.get(id);

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
        old_state: olds,
        new_state: news,
      }
    );
  }
};
