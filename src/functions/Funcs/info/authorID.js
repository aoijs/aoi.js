module.exports = async (d) => {
    const {code} = d.command;
    return {
        code: d.util.setCode({function: d.func, code, result: d.author?.id}),
    };
};
