module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);
  let [type,text=""] = inside.splits; 
  if(!type) return d.error(`\`Please provide a Type (encode/decode)\``)
  else if(type=="encode"){
  text=encodeURIComponent(text);
  }
  else if(type=="decode"){
  text=decodeURIComponent(text);
  }
  else {
  return d.error(`\`Please provide a Type(encode/decode)\``);
  }
  return {
    code: code.replaceLast(`$uri${inside}`,text),
  };
};
