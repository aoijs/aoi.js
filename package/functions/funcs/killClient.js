module.exports = async (d) => {
    return {
      code: d.command.code.replaceLast(
        `$killClient`, d.client.destroy())
      
    };
  };
