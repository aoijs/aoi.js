const formatDate = require("../../handlers/FormatDate");

module.exports = (d) => {
  const code = d.command.code,
    r = code.split("$formatDate").length - 1,
    inside = code.split("$formatDate")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let [
    date = Date.now().toLocaleString("en-us", { timeZone: d.timezone }),
    format = "dddd, DD MMMM YYYY",
  ] = inside.splits;
  const checkIsValid = new Date(
    isNaN(new Number(date)) ? date : new Number(date)
  );

  if (isNaN(checkIsValid.getTime())) {
    return d.error(
      `❌ Invalid date for $formatDate in \`$formatDate${inside}\`!`
    );
  }

  return {
    code: code.replaceLast(
      `$formatDate${inside}`,
      format.replace(/\w+/g, (value) =>
        formatDate(value, checkIsValid, d.timezone)
      )
    ),
  };
};
