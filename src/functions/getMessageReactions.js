module.exports = async d => { 
    const data = d.util.aoiFunc(d); 
    const [channelID, messageID, type = "emoji", sep = ", "] = data.inside.splits;

    if (!messageID) {
      return d.aoiError.fnError(d, "custom", {}, "Please enter messageID parameter!");
    }

    const channel = await d.util.getChannel(d, channelID);
    
    const message = await d.util.getMessage(d.channel, messageID);
    
    if (!message) {
      return d.aoiError.fnError(d, "custom", {}, `Message ${messageID} not found!`);
    }

    const reactions = message.reactions.cache.map(reaction => {
      const curemoji = reaction.emoji;

      let emoji;

      switch type {
        case "emoji":
          emoji = curemoji.id
          ? `<:${curemoji.name}:${curemoji.id}>`
          : curemoji.name;
        case "name":
          emoji = curemoji.name;
        case "id":
          emoji = curemoji.id;
      }

      return `${emoji}`;
    }).join(sep);
    
    data.result = reactions ?? null;

    return {
      code: d.util.setCode(data)
    };
  }
