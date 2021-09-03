const {EmbedParser, ComponentParser,FileParser,StickerParser} = require("../../Handler/parsers.js");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelSendMessage").length - 1;

  const inside = code.split("$channelSendMessage")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  let [channelID, content,Embed="", components="",files="", allowMentions="", reply="",stickers="", returnID = "no"] = fields;

  const channel = await d.util.getChannel(channelID);

  if (!channel)
    return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside}));
Embed = await EmbedParser(Embed)
components = await ComponentParser(components)    
files = await FileParser(files) 
    stickers = await StickerParser(stickers) 
    if(allowMentions === "") allowMentions = {} 
    else{
      const a = allowMentions.split(":")
      allowMentions = {parse:a} 
    }
    if(reply === "") reply = {} 
    else{
        reply = {
            messageReference :reply.split(":")[0] 
        }
        allowMentions.repliedUser = reply.split(":")[1]?.addBrackets()||false 
    }
    const data ={
        content: content === "" ? " " : content ,
        embeds :Embed,
        components,
        files,
        stickers,
        allowMentions,
        reply 
    }
    
    const m = await channel.send(data) 
  return {
    code: code.replaceLast(
      `$channelSendMessage${inside}`,
      returnID === "yes" ? m?.id : ""
)
  };
};
