module.exports = async (d) => {
  const code = d.command.code;

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
    return d.error(`:x: Unable to Restart! Error: ${e.message}`);
  }
};
