module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const [seperator = " , "] = inside.splits;

    const result = d.client.aoiOptions.Owner.join(seperator);

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
} 