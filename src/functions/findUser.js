/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [userResolver, returnSelf = "true"] = data.inside.splits;
    userResolver = userResolver
        .addBrackets()
        .replace(/[\\<>@!]/g, "")
        .trim();
    data.result = d.util.findUser(d.client, userResolver);
    if (!data.result)
        data.result = (
            await d.client.users.fetch(userResolver).catch((e) => undefined)
        )?.id;

    data.result = data.result || (returnSelf === "true" ? d.author.id : undefined);

    return {
        code: d.util.setCode(data),
    };
};
