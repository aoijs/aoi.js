module.exports = d => {
    const {code} = d.util.openFunc(d);

    try {
        process.on("exit", () => {
            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit",
            });
        });
        process.exit();
    } catch (e) {
        return d.aoiError.fnError(d, 'custom', {}, `Failed To Restart With Reason: ${e}`);
    }
}