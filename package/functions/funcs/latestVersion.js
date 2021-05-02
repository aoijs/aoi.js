module.exports = async d => {
  /*axios.get('https://api.leref.ga/package/version')
    .then(function (response) {
      let version = response.data.version
      
      return {
        code: d.command.code.replaceLast(`$latestVersion`, version)
      }
    })*/
  let version = "1.0.1"

  return {
    code: d.command.code.replaceLast(`$latestVersion`, version)
  }
}
