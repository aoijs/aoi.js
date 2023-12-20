module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, splitter, sep1 = ' , ', sep2 = '\n'] = data.inside.splits;

    const Data = text.addBrackets()?.split(splitter.addBrackets());

    data.result = Data.map(_ => Data.splice(0, Number(every))).filter(e => e).map(d => d.join(separator1.addBrackets())).join(separator2.addBrackets()).deleteBrackets();

    return {
        code: d.util.setCode(data)
    }
}