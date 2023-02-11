module.exports = async d => {
    const {client, message, msg, author, guild, channel, member, mentions, reactions, util, aoiError, args} = d;
    const data = d.util.aoiFunc(d);

    const __fields__ = data.inside.splits;
    let __output__ = "false"
    if (["true", "false"].includes(__fields__[__fields__.length - 1])) {
        __output__ = __fields__.pop();
    }
    let __evaled__;

    try {
        __evaled__ = await eval(__fields__.join(";").addBrackets());
    } catch (e) {
        d.aoiError.fnError(d, "custom", {}, e);
    }

    data.result = (__output__ === "true" ? (
        typeof __evaled__ === "object" ? require('util').inspect(__evaled__, {depth: 0}).deleteBrackets() : (
            typeof __evaled__ === "string" ? __evaled__.deleteBrackets() : __evaled__
        )
    ) : "")

    return {
        code: data.code.replaceLast(`${d.func}${data.inside}`, data.result)
    }
}