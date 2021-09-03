module.exports = async (d) => {
  const code = d.command.code;


  const inside = d.unpack(); 

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [channelID, opt = "name", separator = ", "] = inside.splits;

  const channel = await d.util.getChannel(channelID) 
if(!channel) return d.error(
d.aoiError.functionErrorResolve(d,"channel",{inside}) 
)
  if (channel.type !== d.util.channelTypes.Category)
    return d.error(
    d.aoiError.functionErrorResolve(d,"custom",{inside},"Provided Id Isn't A Category")
    );

  return {
    code: code.replaceLast(
      `$categoryChannels${inside}`,
      opt === "count"
        ? channel?.children.size
        : opt === "mention"
        ? channel?.children
            .map((a) => a.toString())
            .join(separator)
            .deleteBrackets()
        : channel?.children
            .map((c) => c[opt] || "")
            .join(separator)
            ?.deleteBrackets()||""
    ),
  };
};
