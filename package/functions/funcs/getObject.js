module.exports = async d => {
	const r = d.command.code.split('$getObject').length - 1
	const inside = d.command.code.split('$getObject')[r].after()
	const spaces = Number(inside.splits[0])

  return {
    code: d.command.code.replaceLast(`$getObject${inside.total}`, JSON.stringify(d.object, null, spaces || 0) || "")
  }
}