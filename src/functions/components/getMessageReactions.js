module.exports = async d => { 
    const data = d.util.aoiFunc(d); 
    const [channelID, messageID, type = "emoji", sep = ", "] = data.inside.splits;

    if (!messageID) {
      return d.aoiError.fnError(d, "custom", {}, "Please enter messageID parameter!");
    }

    const channel = await d.util.getChannel(d, channelID);
    
    const message = await d.util.getMessage(channel, messageID);
    
    if (!message) {
      return d.aoiError.fnError(d, "custom", {}, `Message ${messageID} not found!`);
    }

    const reactions = message.reactions.cache.map(reaction => {
      const curemoji = reaction.emoji;

      let emoji;

      switch (type) {
          case "emoji":
              emoji = curemoji.id ? `<:${curemoji.name}:${curemoji.id}>` : curemoji.name;
              break;
          case "name":
              emoji = curemoji.name;
              break;
          case "id":
              emoji = curemoji.id;
              break;
          default:
              return d.aoiError.fnError(d, "custom", {}, `Type ${type} doesn't exist!`)
      }

      return `${emoji}`;
    }).join(sep);
    
    data.result = reactions ?? null;

    return {
      code: d.util.setCode(data)
    };
  }
