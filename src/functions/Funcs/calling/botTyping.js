module.exports = async (d) => {
    const {code} = d.command;

    d.channel.sendTyping();

    return {
        code: d.util.setCode({function: d.func, code}),
    };
};
