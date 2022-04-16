module.exports = async (d) => {
  const data = d.util.openFunc(d);

  let evaled;
  let options = data.inside.inside;
  try {
    evaled = await eval(`d.data.interaction?.${options.addBrackets()}`);
    data.result =
      typeof evaled === "object"
        ? require("util").inspect(evaled, { depth: 0 }).deleteBrackets()
        : typeof evaled === "string"
        ? evaled.deleteBrackets()
        : evaled;
  } catch (e) {
    data.result = "undefined";
  }

  return {
    code: d.util.setCode(data),
  };
};
