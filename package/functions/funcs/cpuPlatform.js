module.exports = async (d) => {
    return {
      code: d.command.code.replaceLast(`$cpuPlatform`, require ('os').platform()),
    };
  };
