const axios = require("axios");
const parser = require("../../handlers/slashCommandOptionsParser");
module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split(`$createSlashCommand`).length - 1;

  const inside = code.split("$createSlashCommand")[r].after();

  let [guildID, name, description, ...opts] = inside.splits;

  let options;

  if (opts.length) {
    options = parser(opts);
  }

  try {
    const request = await axios
      .post(
        d._api(`/applications/${d.client.user.id}/guilds/${guildID}/commands`),
        {
          name: name,
          description: description,
          options: options,
        },
        {
          headers: {
            Authorization: `Bot ${d.client.token}`,
          },
        }
      )
      .catch((err) => null);

    if (!request) return d.error(`❌ Failed to create slash command`);

    return {
      code: code.replaceLast(`$createSlashCommand${inside}`, ""),
    };
  } catch (e) {
    return d.error(`:x: ${e.message}`);
  }
};
