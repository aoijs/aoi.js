module.exports = async d => {
    let code = d.command.code;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [opt, seperator = " , "] = inside.splits;

    if (!["variable", "key", "value", "guild", "for", "type", "timestamp"].includes(opt)) return d.error(`Invalid Option in $newVariable${inside}`)

    return {
        code: code.replaceLast(`$newVariable${inside}`, typeof d.data.newv[opt] == "object" ? d.data.newv[opt].join(seperator) : d.data.newv[opt] || "")
    }
}