module.exports = d => {
  const data = d.util.aoiFunc(d);
  if(data.err) return d.error(data.err);
    
  let numbers = data.inside.splits;
    
  if (numbers.some((x) => isNaN(x) || x.trim() === '')) {
    return d.aoiError.fnError(d, 'custom', { inside: data.inside }, 'Power Numbers Provided In');
  }
    
  data.result = numbers.reduce((current,power) => Number(current)**Number(power));

  return {
    code: d.util.setCode(data) 
  };
}
