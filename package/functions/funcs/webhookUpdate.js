const webhookUpdateOptions = require("../../utils/webhookUpdateOptions");
module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const option = Object.keys(webhookUpdateOptions).find(
    (opt) => opt === inside.inside
  );

  if (!option) return d.error(`\`${d.func}: Invalid option in ${inside}\``);

  const executor = webhookUpdateOptions[option].split(";")[1];

  return {
    code: code.replaceLast(
      `$webhookUpdate${inside}`,
      d.data.channel ? eval(`d.data.channel${executor}`) : ""
    ),
  };
};
