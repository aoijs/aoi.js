module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    let [channelID = d.channel?.id, messageID = d.message?.id, index = 1, option, content] = data.inside.splits;
    index = index - 1;
    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {}, { inside: data.inside });
    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, "message", {}, { inside: data.inside });
    if (isNaN(index) && index < 0) return d.aoiError.fnError(d, "custom", {}, "Invalid Index");
    if (!content) return d.aoiError.fnError(d, "custom", {}, "No Content Provided");
    if (!option) return d.aoiError.fnError(d, "custom", {}, "No Option Provided");
    let embed = new d.embed(message.embeds[index]);
    if (option.startsWith("field")) {
        const fi = option.substring(option.indexOf("field") + 1).match(/\d+/) - 1;
        option = "fields[" + fi + "]." + option.substring(option.indexOf(".") + 1);
    } else if (option == "timestamp") {
        try {
            const ts = new Date(Number(content));
            content = ts.toISOString();
        } catch {
            return d.aoiError.fnError(d, "custom", {}, "Invalid MS Provided");
        }
    } else {
        option = option.replaceAll("authorname", "author.name").replaceAll("authoricon", "author.icon_url").replaceAll("footertext", "footer.text").replaceAll("footericon", "footer.icon_url");
        if (option == "image" || option == "thumbnail") {
            option = option.replaceAll("image", "image.url").replaceAll("thumbnail", "thumbnail.url");
        }
    }
try {
  eval(`embed.data.${option} = content.trim().addBrackets()`);
}
catch {
  return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Option Provided In");
}
    message.edit({ embeds: [embed] }).catch((e) => {
        d.aoiError.fnError(d, "custom", {}, e);
    });
    return {
        code: d.util.setCode(data)
    };
};
