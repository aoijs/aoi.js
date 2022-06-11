module.exports = async d => {
    const data = d.util.aoiFunc(d);

    return {
        code: d.util.setCode({
            function: data.function,
            code: data.code,
            result: require('util').inspect(d.data.error)?.deleteBrackets()
        })
    }
} 