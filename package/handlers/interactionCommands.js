const interpreter = require("../interpreter");

module.exports = async (client, interaction) => {
   let commands;
if(interaction.type === 2){
    client.applications.events.emit("ButtonClick",interaction)
}
  commands = client.slash_commands
    .array()
    .filter(
      (c) =>interaction.type===2 ?c.name.toLowerCase() === interaction.command.name.toLowerCase() : (c.type ===  "button" && c.name.toLowerCase() === interaction.button.customID.toLowerCase())
    );
  if (!commands.length) return;

  const args = [];

  if (interaction.options) {
    for (const option of interaction.options) {
      args.push(((option.value.toString ? option.value.toString() : option.value) || "").trim().split(/ +/g).join(" "));
    }
  }
    //console.log(require('util').inspect(interaction,{depth:0}))

//console.log(interaction)
  for (const command of commands) {
    await interpreter(
      client,
      {
        author: interaction.author,
        member: interaction.member,
        guild: interaction.guild,
        channel: interaction.channel,
        message: interaction.message 
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
