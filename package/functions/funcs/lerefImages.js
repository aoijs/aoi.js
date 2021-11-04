module.exports = async (d) => {
    let Num = Math.floor(Math.random() * 41)

    let Leref = "https://api.leref.ga/image/leref?image=" + Num

    return {
        code: d.command.code.replaceLast(
            "$lerefImages",
            Leref
        ),
    };
};