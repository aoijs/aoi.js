const { Time } = require("../../utils/helpers/customParser.js");

module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  let [time, type, cmdName, id] = data.inside.splits;

  time = Time.parse(time)?.ms;
  if (!time) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Type");

  const types = {
    globalUser: id,
    user: `${id}_${d.message.guild.id || "dm"}`,
    server: id,
    channel: id,
    static: undefined,
  };

  if (!types[type]) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Type");

  const timeEnd = await d.client.db.get("__aoijs_vars__", "cooldown", cmdName + "_" + types[type]);
  data.result = ((timeEnd?.value || d) - Date.now()) < 0 ? 0 : (timeEnd?.value || d) - Date.now();

  return {
    code: d.util.setCode(data),
  };
};
