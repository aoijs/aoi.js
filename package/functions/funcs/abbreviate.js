const {abbreviate}=require('../../Utils/helpers/functions.js')
module.exports = async (d) => {
  const { code } = d.command;
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);
  const [num, dec = 0] = inside.splits;
  const n = Number(num);
  const de = Number(dec);
  if (isNaN(n) && (isNaN(de)))
    return d.error(`$abbreviate:${isNaN(n)?'Invalid Number in '+inside.total:(isNaN(d)?'Invalid Decimal Position in '+inside.total:'')}`);
  let a;
  try {
    a = abbreviate(n, de);
  } catch(e){
    return d.error(`\`${d.func}: There's an error while abbreviating ${inside.total}\``);
      console.error(e)
  }

  return {
    code: code.replaceLast(`$abbreviate${inside}`, a)
  }
};
