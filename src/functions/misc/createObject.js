module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();

    const data = inside.inside;
    try {
        d.object = JSON.parse(data.addBrackets());
    } catch (e) {
        d.aoiError.fnError(d, "custom", {}, "Failed To Create Object With Reason: " + e);
    }

    return {
        code: d.util.setCode({function: d.func, code, inside}),
        data: {...d.data, object: d.object}
    }
} 