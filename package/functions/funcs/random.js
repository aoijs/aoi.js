const random = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const [ n1, n2, allow = "no",random="no"] = inside.splits

    if (inside.splits.length > 4) return d.error(`\`${d.func}: Too many fields in ${inside}\``)
    if (isNaN(Number(n1)) || isNaN(Number(n2)) || Number(n1) >= Number(n2)) return d.error(`\`${d.func}: Invalid number in ${inside}\``)

    let n = allow === "yes" ? Math.random() * (Number(n2) - Number(n1)) + Number(n1): Math.round(Math.random() * (Number(n2) - Number(n1))) + Number(n1)

    if (d.randoms[inside] && random !== "yes") n = d.randoms[inside]
    else if(random === "yes") d.randoms[`${inside}_${Math.floor(Math.random()*999999)}`] = n
    else d.randoms[inside] = n

    return {
        code: code.replaceLast(`$random${inside}`, n),
        randoms: d.randoms
    }
}

module.exports = random
