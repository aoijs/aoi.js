module.exports = async (d) => {
  let code = d.command.code;

  const r = code.split("$deafenUser").length - 1;
  const inside = code.split("$deafenUser")[r].after();

  if (!inside.splits.length)
    return d.error(`:x: Invalid usage in $deafenUser${inside.total}`);

  const [userID, deaf = "yes", reason] = inside.splits;

  const user = await d.util.getUser(userID)

  if (!user)
    return d.error(`${d.func}: Invalid userID in $deafenUser${inside.total}`);

  const state = d.message.guild.voiceStates.cache.get(user.id);

  if (!state || !state.channel)
    return d.error(
      `${d.func}: User is not in any voice channel in ${inside.total}`
    );

  try {
    await state.setDeaf(deaf.toLowerCase() === "yes", reason);
  } catch {
    return d.error(
      `${d.func}: Failed to deafen member in ${inside.total}`
    );
  }

  return {
    code: code.replaceLast(`$deafenUser${inside.total}`, ""),
  };
};
