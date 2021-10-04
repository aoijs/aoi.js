const authorID = (d) => {
  return {
    code: d.command.code.replaceLast(
      "$authorID",
      d.message.author ? d.message.author.id : ""
    ),
  };
};

module.exports = authorID;
