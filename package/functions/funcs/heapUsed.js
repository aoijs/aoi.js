module.exports = async d => {

  return {

    code: d.command.code.replaceLast(`$heapUsed`, (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))

  } 

}
