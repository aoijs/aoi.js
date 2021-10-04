const emojiOptions = require("../../utils/emojiOptions");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

console.log(d.data.old_emoji)

  const option = Object.keys(emojiOptions).find(
    (opt) => opt === inside.inside
  );

  if (!option) return d.error(`❌ Invalid option in \`$oldEmoji${inside}\``);

  const executor = emojiOptions[option].split(";")[1];

  return {
    code: code.replaceLast(
      `$oldEmoji${inside}`,
      d.data.old_emoji ? eval(`d.data.old_emoji${executor}`) : ""
    ),
  };
};