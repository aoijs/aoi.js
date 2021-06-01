const interpreter = require("../interpreter");

module.exports = async (client, oldg, newg) => {
  for (const command of client.guild_update_commands.array()) {
    const data = {
      guild: newg.guild,
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
        old_guild: oldg,
        new_guild: newg,
      }
    );
  }
};
