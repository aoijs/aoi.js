module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    const [...roles] = inside.splits;
    const wrongRoles = []
    const ros = []
    roles.forEach(x => {
        if (!d.guild.roles.cache.find(y => y.name.toLowerCase() === x.toLowerCase().addBrackets() || y.id === x.id)) wrongRoles.push(x)
        else ros.push(d.client.emojis.cache.find(y => y.name.toLowerCase() === x.toLowerCase().addBrackets() || y.id === x.id))
    })
    if (wrongRoles.length) return d.aoiError.fnError(d, "custom", {inside}, `Invalid Roles : ${wrongRoles.join(" , ")} Provided In`);

    for (let i = ros.length - 1; i >= 0; i--) {
        ros[i].delete().catch(e => {
            d.aoiError.fnError(d, "custom", {}, "Failed To Delete Roles: " + ros[i].name + " With Reason: " + e);
        });

    }

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}