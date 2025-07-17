/**
 * @param {import("..").Data} d
 */
module.exports = d => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [format, isAmPm = "false"] = data.inside.splits;
  const date = new Date(new Date().toLocaleString("en-us", { timeZone: d.timezone }));
  let h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
  const am = isAmPm === "true" ? (h >= 12 ? "PM" : "AM") : "";
  h = isAmPm === "true" ? (h % 12 || 12) : h;

  data.result = format
    .replaceAll("{hour}", String(h).padStart(2, "0"))
    .replaceAll("{minute}", String(m).padStart(2, "0"))
    .replaceAll("{second}", String(s).padStart(2, "0"))
    .replaceAll("{am}", am);

  return { code: d.util.setCode(data) };
};
