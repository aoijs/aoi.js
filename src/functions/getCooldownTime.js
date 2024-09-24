const { Time } = require("../core/Time.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  let [time, type, cmdName, id] = data.inside.splits;

  time = Time.parse(time)?.ms;
  if (!time) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Time");

  const types = {
    globalUser: id,
    user: `${id}_${d.message.guild.id || "dm"}`,
    guild: id,
    channel: id,
  };

  if (!types[type]) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Type");

  const timeEnd = await d.client.db.get("__aoijs_vars__", "cooldown", cmdName + "_" + types[type]);
  if (!timeEnd) {
    data.result = 0;
  } else {
    data.result = (timeEnd?.value - Date.now()) < 0 ? 0 : timeEnd?.value - Date.now();
  }

  return {
    code: d.util.setCode(data),
  };
};
