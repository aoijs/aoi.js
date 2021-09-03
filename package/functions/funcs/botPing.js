module.exports = (d) => {
   const code = d.command.code 
  return {
    code: code.replaceLast(`$botPing`,Date.now()-d.message.createdTimestamp)

  };
};
