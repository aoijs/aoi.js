module.exports = async (d) => {
    const code = d.command.code;
    const inside = d.unpack();
    let [text, ...fields] = inside.splits;
    let i = 0;
    while (i < fields.length) {
        let split = fields[i];
        let index = fields[i + 1];
        i += 2;
        index = Number(index) - 1 || 0;
        text = text.addBrackets().split(split.addBrackets())[index] || "";
    }
    return {
        code: code.replaceLast(
            `$advancedTextSplit${inside.total}`,
            text.deleteBrackets(),
        ),
    };
};