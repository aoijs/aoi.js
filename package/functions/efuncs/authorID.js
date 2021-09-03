const authorID = (d) => {
  return {
    code: d.command.code.replaceLast("$authorID",d.author?.id)
  }
};
module.exports = authorID;
