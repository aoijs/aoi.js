module.exports = async (d) => {
  const code = d.command.code;
const inside = d.unpack()
const [force = "no"] = inside.splits 
let bans;
if(force === "yes"){
   bans = await d.guild.fetchBans().catch((err) => {});
}
   else {
       bans = d.guild.bans.cache
     }
  return {
    code: code.replaceLast(
      inside?.inside ? `$banCount${inside}` :`$banCount`,
      bans?.size || "missing permissions"
    ),
  };
};
