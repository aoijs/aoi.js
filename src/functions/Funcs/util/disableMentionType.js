module.exports = async (d) => {
    const data = d.util.openFunc(d);

    const [type = "all"] = data.inside.splits;
    if (!["everyone", "users", "roles", "all"].includes(type))
        d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid Type Provided In",
        );

    switch (type) {
        case "all":
            d.allowedMentions = [];
            break;

        case "everyone":
            d.allowedMentions = d.allowedMentions.filter((x) => x !== "everyone");
            break;
        case "roles":
            d.allowedMentions = d.allowedMentions.filter((x) => x !== "roles");
            break;
        case "users":
            d.allowedMentions = d.allowedMentions.filter((x) => x !== "users");
            break;
    }

    return {
        code: d.util.setCode(data),
        allowedMentions: d.allowedMentions
    }
};
