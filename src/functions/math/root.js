module.exports = d => {
      const data = d.util.aoiFunc(d);
      if (data.err) return d.error(data.err);

      const [number, root] = data.inside.splits;

      if (isNaN(number) || number.trim() === '') return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Number Provided In');
      if (isNaN(root) || root.trim() === '') return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Root Number Provided In');

      data.result = number < 0 && root % 2 === 0 ? NaN : Math.pow(Number(number), 1 / Number(root));

      return {
          code: d.util.setCode(data)
      }
  }
