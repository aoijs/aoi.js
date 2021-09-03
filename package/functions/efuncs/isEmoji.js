module.exports = async d => {
    let code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

        let [text] = inside.splits

        let error = undefined

        
        let result;
        if (!text) result = false
        if (!/[a-zA-Z1234567890]/g.test(text) && /\p{Extended_Pictographic}/u.test(text) && text.length == 2) result = true;
        else result = false;


        return {
            code: code.replaceLast(`$isEmoji${inside}`, result)
        }
    }
