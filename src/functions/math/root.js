function nthRoot(x, n) {
                try {
    var negate = n % 2 == 1 && x < 0;
    if(negate)
      x = -x;
    var possible = Math.pow(x, 1 / n);
    n = Math.pow(possible, n);
    if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
      return negate ? -possible : possible;
  } catch(e){}
}

module.exports = d => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const numbers = data.inside.splits;

  if (numbers.some((x) => isNaN(x) || !x.trim())) {
    return d.aoiError.fnError(d, 'custom', { inside: data.inside }, 'Power Numbers Provided In');
  }

  data.result = numbers.reduce((current,root) => nthRoot(current, root));


  return {
    code: d.util.setCode(data)
  }
}
