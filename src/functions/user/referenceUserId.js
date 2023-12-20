module.exports = async (d) => {
   const data = d.util.aoiFunc(d);
   const [messageID = d.message.id] = data.inside.splits;

   const message = messageID ? await d.channel.messages.fetch(messageID) : d.message;
   if (!message) return d.aoiError.fnError(d, 'message', { inside: data.inside });

   const id = message.reference?.messageId;

   data.result = id ? (await d.channel.messages.fetch(id))?.author.id : '';

   return {
     code: d.util.setCode(data),
   }
 }
