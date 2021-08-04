

const token = db.fetch("TOKEN_0")

const fs = require("fs")

console.log(`Connecting to gateway with token ${token}.`)

const aoijs = require("../index.js")

const Bot = new aoijs.Bot({
    token: token,
    prefix: prefix
})

const file = fs.readFileSync("./test.js", { encoding: "utf-8" })

eval(file.split("\n").slice(18).join("\n"))