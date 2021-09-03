//here u go
const {EmbedParser, ComponentParser, FileParser,ErrorHandler} = require("../../Handler/parsers");
module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$closeTicket").length - 1;

  let inside = code.split("$closeTicket")[r].after();

  const exists = await d.client.db.get(
    d.client.db.tables[0],
    `ticket_${d.message.channel.id}`
  );
    let e;
 try {
   e =  JSON.parse(inside.inside) 
     e.embeds= await EmbedParser (e.embeds||"") 
     e.components =await ComponentParser (e.components||"") 
     e.files = await FileParser(e.files||"") 
 }
 catch(l){
     e = inside.inside 
 }
  if (!exists) d.channel.send(e) 
  const channel = await d.message.channel.delete().catch((err) => null);

  if (!channel) return d.channel.send(e);

  return {
    code: code.replaceLast(`$closeTicket${inside}`, ""),
  };
};
