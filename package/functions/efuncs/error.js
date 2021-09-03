module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$error`,
      d.data.error ? require("util").inspect(d.data.error).deleteBrackets() : ""
    ),
  };
};
