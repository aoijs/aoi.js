module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$charCount").length - 1;

  const after = code.split("$charCount")[r].after();

  if (after.inside) {
    const inside = after.inside;

    return {
      code: code.replaceLast(`$charCount${after}`, inside.length),
    };
  } else {
    return {
      code: code.replaceLast(`$charCount`, d.args.join(" ").length),
    };
  }
};
