const addTimestamp = (d) => {
  const code = d.command.code;

  const r = d.command.code.split("$addTimestamp").length - 1;

  if (r >= 3)
    return d.message.channel.send(`❌ Can't use more than one $addTimestamp `);

  const after = code.split("$addTimestamp")[r].after();

  if (after.inside) {
    const anything = after.inside;

    return {
      code: code.replaceLast(`$addTimestamp${after.total}`, ""),
      embed: d.embed.setTimestamp(Number(anything) || 0),
    };
  } else {
    return {
      code: code.replaceLast(`$addTimestamp`, ""),
      embed: d.embed.setTimestamp(),
    };
  }
};

module.exports = addTimestamp;
