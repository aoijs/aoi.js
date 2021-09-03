module.exports = async (d) => {
  const r = d.command.code.split("$day").length - 1;
  const date = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: d.timezone,
    })
  ); //timezone.exe

  const inside = d.command.code.split("$day")[r].after();

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return {
    code: d.command.code.replaceLast(
      `$day${inside.total}`,
      inside.inside === "yes"
        ? weekdays[date.getDay()]
        : `0${date.getDate()}`.substr(-2)
    ),
  };
  //what u doing
};
