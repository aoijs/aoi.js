  <br />
    <p>
    <a href="https://aoi.leref.ga"><img src="https://cdn.discordapp.com/attachments/804813961190572093/904143573287583814/aoijsv4.6.png" alt="aoi.js" /></a>
  </p>

# aoi.js
[![Discord Server](https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white)](https://aoi.js.org/invite)
[![NPM Version](https://img.shields.io/npm/v/aoi.js.svg?maxAge=3600)](https://www.npmjs.com/package/aoi.js)
[![NPM Downloads](https://img.shields.io/npm/dt/aoi.js.svg?maxAge=3600)](https://www.npmjs.com/package/aoi.js)

## About
aoi.js is a package with customization and ready-to-use functions to make Discord Bots with ease.

- Interaction Commands Support
- Music features Support
- 500+ functions available  

The successor of [dbd.js](https://www.npmjs.com/package/dbd.js)
 
## Installation

**Node.JS 12.0.0 or newer is required.**  

```sh-session
npm install aoi.js
```

### Setup
```js
const aoijs = require("aoi.js")

const bot = new aoijs.Bot({
token: "TOKEN", //Discord Bot Token
prefix: "PREFIX" //Discord Bot Prefix
})

//Events
bot.onMessage()

//Command Example
bot.command({
name: "ping",
code: `Pong! \`$ping\`ms`
})

//Ready Event
bot.readyCommand({
    channel: "",
    code: `$log[Ready on $userTag[$clientID]]`
})
```

### Optional packages
- [@discordjs/opus](https://www.npmjs.com/package/@discordjs/opus) for encoding, primarily used for Music (`npm install @discordjs/opus`)
- [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static) for allowing Music Filters to run smoothly (`npm install ffmpeg-static`)

## Akarui Development

aoi.js is made possible by Akarui Development. <br>
A team of Developers that create packages.

Owned by [Leref](https://leref.ga/) </br>

## Links
- [Website](https://aoi.js.org)
- [Github](https://github.com/aoijs/aoi.js)
- [Discord Server](https://aoi.js.org/invite)
- [Documentation](https://aoi.leref.ga)

## Open Source

aoi.js is available and open source for the community to explore and contribute for future updates.

Please read [Contributing](https://github.com/aoijs/aoi.js/blob/master/.github/CONTRIBUTING.md)