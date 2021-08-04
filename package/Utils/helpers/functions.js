const {SI_SYMBOL} = require('../Constants.js')
module.exports = {
 abbreviate(number, decimal) {
  const tier = Math.floor(Math.log10(Math.abs(number || 1)) / 3);
  if (tier === 0) return number;
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = number / scale;
  return scaled.toFixed(decimal) + suffix;
},
 wait(time){
     new Promise(res=>setTimeout(()=>res,time))
 }
}