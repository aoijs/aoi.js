const {wait} = require('../../Utils/helpers/functions.js')
const addCmdReactions = async (d) => {
  const code = d.command.code;


  const inside = d.unpack()
  for (const reaction of inside.splits){
      const react = d.msg.react(reaction.addBrackets()).catch((err) =>undefined);
    if (!react) return d.error('`ReactionError: Failed To React With:`'+reaction);
      await wait(1000)
  }
  return {
    code: code.replaceLast(`$addCmdReactions${inside.total}`, ""),
  };
};

module.exports = addCmdReactions;