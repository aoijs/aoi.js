const { Team } = require("discord.js");
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [separator = " , "] = data.inside.splits;

    const owner = (await d.client.application.fetch()).owner;
    if (owner instanceof Team) {
        data.result = owner.members.map((x) => x.id).join(separator);
    } else {
        data.result = owner.id;
    }

    return {
        code: d.util.setCode(data),
    };
};
