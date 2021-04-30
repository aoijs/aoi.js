const Discord = require("discord.js");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$findMembers").length - 1;

  const inside = code.split("$findMembers")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [
    query,
    limit = 10,
    custom_message = "{position} - {name} - {id}",
    choose,
  ] = inside.splits;

  const members = await d.message.guild.members
    .fetch({
      query: query.addBrackets(),
      limit: Number(limit),
    })
    .catch((err) => new Discord.Collection());

  let toReturn;

  if (choose) {
    let member = members.array()[Number(choose) - 1];

    toReturn = member ? member.user.id : "";
  } else {
    let content = [];

    let y = 1;

    for (const member of members.array().slice(0, Number(limit))) {
      content.push(
        custom_message
          .replace(/{(username|name)}/gi, member.user.username.addBrackets())
          .replace(/{tag}/gi, member.user.tag.addBrackets())
          .replace(/{id}/g, member.user.id)
          .replace(/{position}/g, y)
          .replace(/{(nick|nickname)}/gi, (member.nickname || "").addBrackets())
      );

      y++;
    }

    toReturn = content.join("\n");
  }

  return {
    code: code.replaceLast(`$findMembers${inside}`, toReturn),
  };
};
