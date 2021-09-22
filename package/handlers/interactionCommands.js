const interpreter = require("../interpreter");

module.exports = async (client, interaction) => {
   let commands;
if(interaction.type === 3){
    client.applications.events.emit("ButtonClick",interaction)
}
  commands = client.slash_commands
    .array()
    .filter(
      (c) =>interaction.type===2 ? (Array.isArray(c.name) ? c.name.map(x=>x.toLowerCase()).includes(interaction.command.name.toLowerCase()) : c.name.toLowerCase() === interaction.command.name.toLowerCase()): (c.prototype ===  "button" && Array.isArray(c.name) ? c.name.find(x=> x === interaction.button.customID) : c.name === interaction.button.customID)
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
        message: interaction.message,
        client : client 
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
