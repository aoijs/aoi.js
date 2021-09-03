const {EmbedParser, FileParser, ComponentParser,ErrorHandler} = require("../../Handler/parsers.js") 

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$editMessage").length - 1;

  const inside = code.split("$editMessage")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [messageID, msg, channelID = d.message.channel.id] = inside.splits;

  const channel = await d.util.getChannel(d,channelID);

  if (!channel)
    return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside}));



  const message = await d.util.getMessage(channel, messageID)

  if (!message)
    return d.error(d.aoiError.functionErrorResolve(d,"message",{inside}));

  if (message.author.id !== d.client.user.id)
    return d.error(`${d.func}: Unauthored message!`);
    let data ;
  try {
       data = JSON.parse(msg) 
      data.embeds = await EmbedParser (data.embeds||"") 
      data.components = await ComponentParser (data.components||"") 
      data.files = await FileParser(data.files||"") 
      data.content = (!data.content || data.content === "") ? " " : data.content 
  }
    catch(e){
        data = await ErrorHandler(d,msg,true) 
    }
  
  await message.edit(data);

  return {
    code: code.replaceLast(`$editMessage${inside}`, ""),
  };
};
