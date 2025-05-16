const { ContainerBuilder } = require("discord.js");

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [components] = data.inside.splits;

    console.log(components);

    const builder = new ContainerBuilder(components);

    console.log(builder);

    return {
        code: d.util.setCode(data),
    }
}