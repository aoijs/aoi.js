const { Time } = require("../../utils/helpers/customParser.js");

module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  let fields = data.inside.splits;
  let i = 0;

  if (isNaN(fields[0]) || fields[0] < 0) i = -1;

  const index = Number(fields[i] ?? 1) - 1;
  const embed = fields[i + 1] ?? Date.now();
  const timestamp = Time.parse(embed)?.ms ?? embed;

  if (!d.embeds[index]) d.embeds[index] = new d.embed();

  d.embeds[index].setTimestamp(timestamp);

  return {
    code: d.util.setCode(data),
    data: { ...d.data, embeds: Object.assign({}, d.data.embeds, d.embeds) },
    embeds: d.embeds,
  };
};
