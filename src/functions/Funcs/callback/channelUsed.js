module.exports = d => {
    const {code} = d.command;
    const inside = d.unpack();

    return {
        code: d.util.setCode({function: d.func, code, inside, result: d.channelUsed})
    }
}