module.exports = async d => {
    const {code} = d.util.openFunc(d);

    d.message.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Message With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code})
    }
} 