module.exports = async d => {

    const {code} = d.command

    const inside = d.unpack()

    const err = d.inside(inside)

    if (err) d.error(err)

    const [type, ...ids] = inside.splits;

    if (!d.client.blacklist[type]) return d.error(d.aoiError.functionErrorResolve(d, "custom", {inside}, "Invalid Type Provided In"))

    d.client.blacklist.whitelistIds(type, ...ids)

    return {

        code: code.replaceLast(`$whitelist${inside}`, "")

    }

}