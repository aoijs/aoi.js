module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID = d.channel?.id, amount, filters, returnCount = "false"] = data.inside.splits;

    if (isNaN(amount) || amount < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Amount, must be a number and greater than 0");

    amount = Number(amount);

    if (amount > 100) amount = 100;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    let messages = await channel.messages.fetch({ limit: amount, cache: true }).catch((err) => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Fetch Messages With Reason: " + err);
    });

    filters = filters
        .split("}")
        .map(function (x) {
            x = x.replace("{", "").trim();
            if (x.length === 0) return null;
            let [key, value] = x.split(":");
            return { [key]: value.split(",") };
        })
        .filter(Boolean);

    messages = [...messages.values()]
        .filter((x) => {
            let passed = false;
            for (let filter of filters) {
                let key = Object.keys(filter)[0];
                let value = filter[key];
                if (key === "users" && value.includes(x.author?.id)) passed = true;
                if (key === "words" && value.some((word) => x.content.includes(word))) passed = true;
                if (key === "bots" && x.author?.bot === (value === "true")) passed = true;
                if (key === "unpinned" && x.pinned !== (value === "true")) passed = true;
            }
            return passed;
        })
        .slice(0, amount);

    const result = await channel.bulkDelete(messages, true).catch((err) => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Message With Reason: " + err);
    });

    data.result = returnCount === "true" ? result.size : null;

    return {
        code: d.util.setCode(data)
    };
};
