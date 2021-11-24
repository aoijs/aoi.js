module.exports = d => {
    const {code, inside} = d.util.openFunc(d);

    const [format = "yes"] = inside.splits;

    return {
        code: d.util.setCode({
            function: d.func,
            code,
            inside,
            result: JSON.stringify(d.object, null, format === "yes" ? 2 : 0)
        })
    }

}