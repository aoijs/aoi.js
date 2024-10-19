module.exports = async d => { 
    const data = d.util.aoiFunc(d); 
    const [messageID, type = 'emoji', sep = ', '] = data.inside.splits;
    if (!messageID) {
      return d.aoiError.fnError(d, 'custom', {}, 'Enter messageID parameter!');
    }
    try {
      const channel = d.message.channel;
      
      const message = await channel.messages.fetch(messageID);
      
      if (!message) {
        return d.aoiError.fnError(d, 'custom', {}, `Can't find message with id: ${messageID}!`);
      }
      const reactions = message.reactions.cache.map(reaction => {
        const curemoji = reaction.emoji;
        let emoji;
        if (type === 'emoji') {
            emoji = curemoji.id
            ? `<:${curemoji.name}:${curemoji.id}>`
            : curemoji.name;
        } else if (type === 'name') {
            emoji = curemoji.name
        } else if (type === 'id') {
            emoji = curemoji.id
        }
        return `${emoji}`;
      }).join(sep);
            
      
      if (!reactions) {
        return d.aoiError.fnError(d, 'custom', {}, `Message: ${messageID} doesn't has any reactions!`);
      }
      data.result = reactions;
    } catch (error) {
      return d.aoiError.fnError(d, 'custom', {}, `Error: ${error.message}`);
    }
    return {
      code: d.util.setCode(data)
    };
  }