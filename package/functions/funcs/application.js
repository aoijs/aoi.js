const moment = require("moment");
const ms = require("parse-ms");

module.exports = async (d) => {
  const code = d.command.code;
  const application = await d.client.fetchApplication()
  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let option = inside.inside;

  
  let createdat = moment(application.createdAt).format("LLLL");

  
  let createdtimestamp = Object.entries(ms(Date.now() - application.createdTimestamp))
    .map((x, y) => {
      if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`;
    })
    .filter((x) => x)
    .join(", ");

  if (!option) return d.error(`:x: Missing property in \`$application${inside}\`.`);
  if (
    ![
      "name",
      "id",
      "description",
      "icon",
      "createdTimestamp",
      "createdAt",
      
      
    ].includes(option)
  )
    return d.error(`:x: Invalid property in \`$client${inside}\`.`);

  switch (option) {
    case "name":
      option = application.name;
      break;
    case "id":
      option = application.id;
      break;
    case "description":
      option = application.description;
      break;
    case "icon":
      option = application.iconURL();
      break;
    case "createdTimestamp":
      option = createdtimestamp;
      break;
    case "createdAt":
      option = createdat;
      break;
 
    default:
      undefined;
  }

  return {
    code: d.command.code.replaceLast(`$application${inside}`, option),
  };
};
