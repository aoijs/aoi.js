const interpreter = require("../interpreter");

module.exports = async (client, interaction) => {
  const commands = client.slash_commands
    .array()
    .filter(
      (c) => c.name.toLowerCase() === interaction.command.name.toLowerCase()
    );

  if (!commands.length) return;

  const args = [];

  if (interaction.options) {
    for (const option of interaction.options) {
      args.push(((option.value.toString ? option.value.toString() : option.value) || "").trim().split(/ +/g).join(" "));
    }
  }

  for (const command of commands) {
    await interpreter(
      client,
      {
        author: interaction.author,
        member: interaction.member,
        guild: interaction.guild,
        channel: interaction.channel,
      },
      args,
      command,
      undefined,
      undefined,
      undefined,
      {
        interaction: interaction,
      }
    );
  }
};
