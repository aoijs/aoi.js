module.exports = async (d) => {
     const code = d.command.code;
     const inside = d.unpack();
     const err = d.inside(inside);
     if (err) return d.error(err);

     let option = inside.inside;
     if (!option) return d.error(`\`${d.func}: Missing text in ${inside}\``);
     const regex = !/[^a-zA-Z0-9 ]+/g.test(option);
     if (!regex) return d.error(`\`${d.func}: Invalid text in ${inside}\``);
     let Cases = [
  String.prototype.toUpperCase,
  String.prototype.toLowerCase
]
     let str = option.toString();
     let l = str.length;
     let result = '';
     let a;
     let b;
     let c;

  for (b = 0; b < l; b++) {
    c = Number(Math.random() <= 0.5);
    a = Cases[c];
    result += a.call(str[b])
  }
  return {
    code: d.command.code.replaceLast(`$randomCase${inside}`, result),
  }
}
