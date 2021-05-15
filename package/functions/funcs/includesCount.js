const embed = require("../../handlers/errors.js");

module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
 const splittedinside = inside.split(";")

const str = splittedinside[1]
const search = splittedinside[2]
  if (!str) {
  const error = `Error! Invalid search term in \`$includesCount${inside}\` `;
  return embed(d, error); 
  }
  if (!search) {
  const error = `Error! Invalid term to search in \`$includesCount${inside}\` `;
  return embed(d, error); 
  }
  
const array = str.trim().split(" ");
let c = 0;
array.forEach(word => {
if (word.includes('apple')) {
c = c+1
}
})
  
    return {
        code: code.replaceLast(`$includesCount${inside}`, c.deleteBrackets())
    }

}
