module.exports = async d => {
  return {
    code: d.command.code.replaceLast(`$ram`, (process.memoryUsage().rss / 1024 / 1024).toFixed(2))
  } 
} 