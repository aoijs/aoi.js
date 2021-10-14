module.exports = async d => {

  return {

    code: d.command.code.replaceLast(`$heapTotal`, (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2))

  } 

}
