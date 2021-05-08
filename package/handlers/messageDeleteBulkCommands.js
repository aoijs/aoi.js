const interpreter = require("../interpreter");

module.exports = async (client, bulk) => {
  for (const command of client.message_delete_bulk_commands.array()) {
    const data = {
      guild: bulk.guild,
      channel: bulk.channel,
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

    const ch = client.channels.cache.get(id);

    //if (!channel) return console.error(`channel with ID ${id} does not exist`)

    data.channel = ch;

    await interpreter(
      client,
      data,
      [],
      command,
      undefined,
      undefined,
      undefined,
      {
        messages: bulk,
      }
    );
  }
};
