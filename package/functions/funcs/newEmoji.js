const emojiOptions = require("../../utils/emojiOptions");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const option = Object.keys(emojiOptions).find(
    (opt) => opt === inside.inside
  );

  if (!option) return d.error(`\`${d.func}: Invalid option in ${inside}\``);

  const executor = emojiOptions[option].split(";")[1];

  return {
    code: code.replaceLast(
      `$newEmoji${inside}`,
      d.data.new_emoji ? eval(`d.data.new_emoji${executor}`) : ""
    ),
  };
};
