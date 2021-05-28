module.exports = async (d) => {
    return {
      code: d.command.code.replaceLast(`$cpuModel`, require ('os').cpus()[0].model),
    };
  };
