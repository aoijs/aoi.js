const axios = require("axios");
const parser = require("../../handlers/slashCommandOptionsParser");
module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split(`$deleteSlashCommand`).length - 1;

  const inside = code.split(`$deleteSlashCommand`)[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [guildID, option] = inside.splits;

  let commands = await axios
    .get(
      d._api(`/applications/${d.client.user.id}/guilds/${guildID}/commands`),
      {
        headers: {
          Authorization: `Bot ${d.client.token}`,
        },
      }
    )
    .catch((err) => null);

  if (!commands) return d.error(`:x: Failed to fetch guild commands`);
  else commands = commands.data;

  const command = commands.find(
    (c) => c.name.toLowerCase() === option.toLowerCase() || c.id === option
  );

  if (!command)
    return d.error(`❌ Could not find any command with name/id ${option}`);

  const request = axios
    .delete(
      d.client._api(
        `/applications/${d.client.user.id}/guilds/${guildID}/commands/${command.id}`
      ),
      {
        headers: {
          Authorization: `Bot ${d.client.token}`,
        },
      }
    )
    .catch((err) => null);

  if (!request)
    return d.error(`❌ Failed to delete slash command ${command.name}`);

  return {
    code: code.replaceLast(`$deleteSlashCommand${inside}`, ""),
  };
};
