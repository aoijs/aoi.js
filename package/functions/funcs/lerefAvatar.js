module.exports = async (d) => {
  const Leref = d.client.users.cache.get("608358453580136499") || ( await d.client.users.fetch("608358453580136499", true) );
  return {
    code: d.command.code.replaceLast(
      "$lerefAvatar",
      Leref.displayAvatarURL({ dynamic: true, size: 4096 })
    ),
  };
};
