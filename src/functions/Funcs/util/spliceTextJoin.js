module.exports = d => {
    const datas = d.util.openFunc(d);
    if (datas.err) return d.error(datas.err);

    const [text, splitter, sep1 = ' , ', sep2 = '\n'] = datas.inside.splits;

    const data = text.addBrackets()?.split(splitter.addBrackets());

    datas.result = data.map(_ => data.splice(0, Number(every))).filter(e => e).map(d => d.join(separator1.addBrackets())).join(separator2.addBrackets()).deleteBrackets();

    return {
        code: d.util.setCode(datas)
    }
}