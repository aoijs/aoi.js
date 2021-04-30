module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    try {
      var json = JSON.parse(inside.addBrackets())
    } catch(err) {
      
    }

    return {
        code: code.replaceLast(`$isValidObject${inside}`, json ? true : false)
    }
}