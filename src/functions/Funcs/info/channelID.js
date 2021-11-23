module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();

    const [name] = inside.splits;

    const result = name ? d.client.channels.cache.find(x => x.name.toLowerCase() === name.toLowerCase().addBrackets())?.id : d.channel?.id;

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}