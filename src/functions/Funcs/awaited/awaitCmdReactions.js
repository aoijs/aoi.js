const { Time } = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
  const { code } = d.command;
  const inside = d.unpack();

  const err = d.inside(inside);
  if (err) return d.error(err);

  let [userfilter, time, reactions, commands, errorMsg = "", data = ""] =
    inside.splits;

  reactions = reactions.split(",");

  const filter = (r, u) => {
    return (
      (userfilter === "everyone"
        ? u.id !== d.client.user.id
        : u.id === userfilter) &&
      (reactions.includes(r.emoji.toString()) ||
        reactions.includes(r.emoji.name) ||
        reactions.includes(r.emoji.id))
    );
  };

  time = Time.parse(time)?.ms;
  if (!time)
    d.aoiError.fnError(d, "custom", { inside }, "Invalid Time Provided In");

  commands = commands.split(",");
  commands.forEach((cmd) => {
    if (
      !d.client.cmd.awaited.find(
        (x) => x.name.toLowerCase() === cmd.toLowerCase(),
      )
    )
      d.aoiError.fnError(
        d,
        "custom",
        {},
        "Awaited Command: " + cmd + " Doesn't Exist",
      );
  });

  if (data !== "") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      d.aoiError.fnError(d, "custom", { inside }, "Invalid Data Provided In");
    }
  }
  d.message
    .awaitReactions({ filter, time })
    .then(async (collected) => {
      collected = collected.first();
      const index = reactions.findIndex(
        (r) =>
          (r === collected.emoji?.toString()) | (r === collected.emoji?.id) ||
          r.toLowerCase() === collected.emoji?.name.toLowerCase(),
      );
      const cmd = d.client.cmd.awaited.find(
        (x) => x.name.toLowerCase() === commands[index]?.toLowerCase(),
      );
      if (!cmd)
        return d.aoiError.fnError(
          d,
          "custom",
          {},
          "Invalid Await Command: " + commands[index],
        );
      await d.interpreter(
        d.client,
        d.message,
        d.args,
        cmd,
        d.client.db,
        false,
        undefined,
        { awaitData: data, ...d.data },
      );
    })
    .catch(async (err) => {
      if (errorMsg !== "") {
        const emsg = await d.util.errorParser(errorMsg, d);
        d.aoiError.makeMessageError(d.client, d.channel, emsg, emsg.options);
      } else d.aoiError.consoleError("$awaitCmdReactions", err);
    });
  return {
    code: d.util.setCode({ function: d.func, code, inside }),
  };
};
