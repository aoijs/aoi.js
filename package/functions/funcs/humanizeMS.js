const Durations = {
  ms:1,
  second: 1 * 1000,
  minute: (1 * 1000) * 60,
  hour: ((1 * 1000) * 60) * 60,
  day: (((1 * 1000) * 60) * 60) * 24,
  month: ((((1 * 1000) * 60) * 60) * 24) * 30,
  year: (((((1 * 1000) * 60) * 60) * 24) * 30) * 12
}

module.exports = d => {
  const code = d.command.code 
  const after = d.unpack()
	const err = d.inside(after)

	if (err) return d.error(err)
  let [
    ms,
    limit = "2",
    separator = " "
  ] = after.splits
  const array = new Array()

  if (isNaN(new Number(ms))) return d.error("❌ First Field must be a Number at `$humanizeMS" + after.total + "`!")
  loop:
  for (const Duration of Object.keys(Durations).reverse()) {
    const Amount = BigInt(ms) / BigInt(Durations[Duration])

    if (Amount < 1) continue loop;
    ms = BigInt(ms) - BigInt(BigInt(Durations[Duration]) * Amount)
    array.push(`${Amount} ${Duration}${Amount > 1n && Duration !== "ms" ? "s" : ""}`)
  }

    const newArray = array.splice(0, new Number(limit))

    if (newArray.length !== 1) newArray[newArray.length - 1] = `and ${newArray[newArray.length - 1]}`;
    const joinedArray = newArray.join(separator)

    return {
      code:code.replaceLast(`$humanizeMS${after}`, joinedArray)
    }
  
}