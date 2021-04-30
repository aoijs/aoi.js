const interpreter = require("../interpreter.js");

module.exports = async (client, rate) => {
  for (const command of client.ratelimit_commands.array()) {
    const data = {
      author: client.user,
      member: {},
    };

    const id =
      command.channel && command.channel.includes("$")
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
        ratelimit: rate,
      }
    );
  }
};
