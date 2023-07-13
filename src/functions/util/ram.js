module.exports = d => {
    const data = d.util.aoiFunc(d);

    const [type = 'rss'] = data.inside.splits;

    data.result = process.memoryUsage()[type] / 1024 / 1024;

    return {
        code: d.util.setCode(data)
    }
}
