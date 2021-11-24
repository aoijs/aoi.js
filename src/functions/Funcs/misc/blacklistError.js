module.exports = async d => {

    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [type, ErrorMsg = ""] = inside.splits;

    if (!d.client.blacklist.types.includes(type)) return d.aoiError.fnError(d, "custom", {inside}, "Invalid Type Provided In");

    ErrorMsg = await d.util.errorParser(ErrorMsg);

    d.client.blacklist[type].errorMsg = ErrorMsg;

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}