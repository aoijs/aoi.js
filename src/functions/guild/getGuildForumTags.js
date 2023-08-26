module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [forumId, option = "id", separator = " , "] = data.inside.splits;

    const forum = await d.util.fetchChannel(d, forumId);

    const parseTags = forum.availableTags
        .filter(tag => tag.emoji !== null)
        .map(tag => {
            let result;
            switch (option.toLowerCase()) {
                case "emoji":
                    result = tag.emoji.name || `<${tag.emoji.animated ? "a" : ""}:${tag.emoji.name || "undefined"}:${tag.emoji.id}>`;
                    break;
                case "emojiid":
                    result = tag.emoji.id !== null ? tag.emoji.id : "undefined";
                    break;
                case "moderated":
                    result = tag.moderated;
                    break;
                case "name":
                    result = tag.name;
                    break;
                case "id":
                    result = tag.id;
                    break;
                default:
                    result = "unknown";
                    break;
            }
            return result;
        });

    if (option.includes("{") && option.includes("}")) {
        const parseCustomTags = [];
        for (const tag of forum.availableTags) {
            const format = option.replace(/\{(\w+)\}/g, (_, key) => {
                let tags;
                if (key.toLowerCase() === "emoji") {
                    if (tag.emoji && tag.emoji.name !== "unknown" && tag.emoji.id !== null) {
                        tags = tag.emoji.animated ? `<a:${tag.emoji.name}:${tag.emoji.id}>` : `<:${tag.emoji.name}:${tag.emoji.id}>`;
                    } else if (tag.emoji && tag.emoji.name !== "unknown") {
                        tags = tag.emoji.name;
                    } else {
                        tags = "";
                    }
                } else if (key.toLowerCase() === "emojiid") {
                    tags = tag?.emoji?.id !== null ? tag?.emoji?.id : "unknown";
                } else if (key.toLowerCase() === "managed") {
                    tags = tag?.managed !== null ? tag?.managed : "unknown";
                } else if (key.toLowerCase() === "id") {
                    tags = tag?.id !== null ? tag?.id : "unknown";
                } else {
                    tags = tag[key] !== undefined ? tag[key] : `${key}`;
                }
                return tags;
            });
            if (format) {
                parseCustomTags.push(format);
            }
        }
        data.result = parseCustomTags.length > 0 ? parseCustomTags.join(separator) : "null";
    } else {
        data.result = parseTags[0] === "unknown" ? d.aoiError.fnError(d, "custom", { inside: data.inside }, "option provided.") : (parseTags.length > 0 ? parseTags.join(separator) : "null");
    }

    return {
        code: d.util.setCode(data)
    };
}
