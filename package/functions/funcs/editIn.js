const ms = require("ms");

const editIn = async (d) => {
  const code = d.command.code;

  if (code.split("$editIn").length >= 3)
    return d.message.channel.send(`:x: Cant use more than one $editIn.`);

  const inside = code.split("$editIn")[1].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const time = ms(fields.shift());

  return {
    code: code.replaceLast(`$editIn${inside}`, ""),
    editIn: {
      time: time,
      fields: fields,
    },
  };
};

module.exports = editIn;
