module.exports = async (d) => {
    return {
      code: d.command.code.replaceLast(
        `$killClient`, client.destroy())
      ),
    };
  };
