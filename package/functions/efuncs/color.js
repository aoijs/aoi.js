const color = (d) => {
  
  const inside = d.unpack();
  const err = d.inside(inside) 
  if(err) return d.error(err) 
  let [index=1,color] = inside.splits; 
    if(isNaN(Number(index-1))) d.error("$color: Invalid Index")
    d.embed.setColor(color)
    d.embeds[index-1].color = d.embed.color 

  return {
    code: d.command.code.replaceLast(`$color${inside}`, ""),
    embeds: d.embeds 
  };
};

module.exports = color;
