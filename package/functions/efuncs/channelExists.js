module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack() 
  const channel = await d.util.getChannel(inside.inside)

  return {
    code: code.replaceLast(`$channelExists${inside}`, channel ? true : false),
  };
};
