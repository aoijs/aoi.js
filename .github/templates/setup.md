# Setup

Create a new file named `index.js` and paste the following code:

```js

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Intents, GatewayEventNames } = require("aoiluna");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AoiClient, Transpiler } = require("./dist/cjs");

const client = new AoiClient({
    caches: {
        guilds: {
            class: "Guild",
            sweeper: {
                type: "noSweep",
                timer: null,
            },
        },
        channels: {
            class: "Channel",
            sweeper: {
                type: "noSweep",
                timer: null,
            }
        }
    },
    intents: Intents.Guilds | Intents.MessageContent | Intents.GuildMessages,
    token: "TOKEN",
    prefixes: ".",
    events: ["MessageCreate"],
});
client.client.on(GatewayEventNames.Ready, () => {
    console.log("Ready!");
} );

client.transpiler = Transpiler;

client.cmds.add({
    name: "ping",
    code: "Pong! $pingms",
    type: "basic",
    __path__: "index.js",
} );

client.cmds.add({
    name: "eval",
    code: `
    $comment[ YOUR_ID needs n at the end as it is a bigint]
    $onlyif[$authorId=== YOUR_IDn ;no]
    $eval[true;$message]
    `,
    type: "basic",
    __path__: "index.js",
});

client.cmds.add({
    name: "jseval",
    code: `
    $onlyif[$authorId=== YOUR_IDn;no]
    \`\`\`js
    $jseval[true;$message]
    \`\`\`
    `,
    type: "basic",
    __path__: "index.js",
});

client.cmds.add({
    name: "transpile",
    aliases: ["con"],
    code: `
    \`\`\`js
    $jseval[true;(async() => {
    const Transpiler = this.bot.transpiler;
    const res = await Transpiler(\`$message\`, { minify: true });
    return res.func.toString();
    })();
    ]
    \`\`\`
    `,
    type: "basic",
    __path__: "index.js",
});

client.cmds.add({
    name: "rawcon",
    code: `
    \`\`\`js
    $jseval[true;(async() => {
    const Transpiler = this.bot.transpiler;
    const res = await Transpiler(\`$message\`, { minify: false });
    return res.func.toString();
    })();
    ]
    \`\`\`
    `,
    type: "basic",
    __path__: "index.js",
} );

client.cmds.add( {
    name: "funcs",
    code: `
    \`\`\`js
    $jsEval[true;(async() => { const funcs = await import("../functions/index.js"); return Object.keys(funcs.default.default); })()]
    \`\`\`
    `,
    type: "basic",
    __path__: "index.js",
} );
```
