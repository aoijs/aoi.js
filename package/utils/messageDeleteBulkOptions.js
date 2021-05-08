module.exports = {
  channelid: "The ID of the channel where the pins were updated;.first().channel.id",
  channel: "The name of the channel where the pins were updated;.first().channel.name.deleteBrackets()",
  amount: "The type of the channel where the pins were updated;.array().length",
  guild: "The guild's name of the channel where the messages were deleted;.first().channel.guild.name.deleteBrackets()",
  guildid: "The guild's ID of the channel where the messages were deleted;.first().channel.guild.id",
  messages: "All deleted messages' content and author;.map(msg => `${msg.author.tag}: ${msg.content}`).join('\\n')",
  lastmessages: "10 last deleted messages' content and author;.map(msg => `${msg.author.tag}: ${msg.content}`).slice(0,10).join('\\n')",
  ids: "Returns a list of all message IDs of the deleted messages;.map(msg => `${msg.id}`).join(', ')",
  lastids: "Returns a list of message IDs of the last 10 deleted messages;.map(msg => `${msg.id}`).slice(0,10).join(', ')",
};
