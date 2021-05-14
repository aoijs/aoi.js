module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
const img = inside
  
nsfwjs.load()
  .then(function (model) {
    return {
        code: code.replaceLast(`$NSFWtype${inside}`, model.classify(inside).deleteBrackets())
    }
  })

  
}
/*
Usage: $checkNSFW[Image URL]


The library categorizes image probabilities in the following 5 classes:

Drawing - safe for work drawings (including anime)
Hentai - hentai and pornographic drawings
Neutral - safe for work neutral images
Porn - pornographic images, sexual acts
Sexy - sexually explicit images, not pornography
*/
