module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);
  let templates;

  const [guildID = d.guild?.id, option = "code", separator = " , "] = data.inside.splits;

  try {
    const guild = await d.util.getGuild(d, guildID);
    templates = await guild.fetchTemplates();
  } catch (err) {
    data.result = undefined;
    return;
  }

  data.result = templates.map(x => option.split(".").reduce((obj, prop) => obj && obj[prop], x)).join(separator);
  
  return {
    code: d.util.setCode(data),
  };
};