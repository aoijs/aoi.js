const ms = require("parse-ms");

const uptime = (d) => {
  let code = d.command.code;
  return {
    code: code.replaceLast(
      `$uptime`,
      Object.entries(ms(d.client.uptime))
        .map((x, y) => {
          if (x[1] && y < 4) return `${x[1]}${x[0][0]}`;
          else return undefined;
        })
        .filter((e) => e)
        .join(" ")
    ),
  };
};

module.exports = uptime;
