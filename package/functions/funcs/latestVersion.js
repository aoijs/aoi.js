const axios = require('axios')

module.exports = async d => {
  let version = axios.get('https://registry.npmjs.org/aoi.js').then(a => a.data["dist-tags"].latest)
  return {
    code: d.command.code.replaceLast(`$latestVersion`, version)
  }
}
