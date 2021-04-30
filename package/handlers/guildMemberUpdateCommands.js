const interpreter = require("../interpreter.js");

module.exports = async (client, oldm, newm) => {
  for (const command of client.member_update_commands.array()) {
    const data = {
      author: oldm.author || newm.author,
      member: newm,
      guild: newm.guild,
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

    const channel = newm.guild.channels.cache.get(id);

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
        old_member: oldm,
        new_member: newm,
      }
    );
  }
};
