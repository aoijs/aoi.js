

const token = db.fetch("TOKEN_0")

const fs = require("fs")

console.log(`Connecting to gateway with token ${token}.`)

const dbd = require("../index.js")

const Bot = new dbd.Bot({
    token: token,
    prefix: "!"
})

const file = fs.readFileSync("./test.js", { encoding: "utf-8" })

eval(file.split("\n").slice(18).join("\n"))