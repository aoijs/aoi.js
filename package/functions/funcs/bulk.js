const messageDeleteBulkOptions = require("../../utils/messageDeleteBulkOptions");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

    
  const option = Object.keys(messageDeleteBulkOptions).find(
    (opt) => opt === inside.inside
  );

  if (!option) return d.error(`\`${d.func}: Invalid option in ${inside}\``);

  const executor = messageDeleteBulkOptions[option].split(";")[1];

  return {
    code: code.replaceLast(
      `$bulk${inside}`,
      d.data.messages ? eval(`d.data.messages${executor}`) : ""
    ),
  };
};
