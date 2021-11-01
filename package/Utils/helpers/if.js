const interpreter = require('../../interpreter.js')
const IF = async (d) => {
    const { code } = d.command
    let results = []
    let everything;
    let pass;
    let elseIfPass;
    if (code.toLowerCase().includes("$if[")) {
        for (let statement of code.split(/\$if\[/gi).slice(1).reverse()) {
            let everything = statement.split(/\$endif/gi)[0]

            let condition = statement.split("\n")[0].trim()
            condition = condition.slice(0, condition.length - 1)
            statement = statement.split(/$endif/)[0].split("\n").slice(1).join("\n")
        }
    }
}
module.exports = IF;