const { Group } = require("@aoijs/aoi.structures");
const { functions: parser, maps, grp } = require("../core/AoiReader.js");

class Block {
    constructor(func) {
        this.parent = func;
        this.childs = [];
    }

    add(child) {
        this.childs.push(child);
    }
}

class Function {
    constructor(code, name) {
        this.name = name;
        this.code = code;
    }
}

class CustomFunction {
    constructor(d = {}, client) {
        this.client = client;
        this.name = d.name;
        this.code = d.code;
        this.type = d.type;
        this.params = d.params || [];
        this.functions = this.type === "aoi.js" ? this.serializeFunctions() : [];
    }

    serializeFunctions() {
        const Functions = this.client.functionManager.functions;
        const code = this.code
            ?.replace(/\\]/g, "#LEFT#")
            .replace(/\\\[/g, "#RIGHT#")
            .replace(/\\,/g, "#COMMA#");
        const funcs = [];
        const loadsOfFunc = Functions.filter(func =>
            code.toLowerCase().includes(func.toLowerCase())
        );
        const funcParts = code.split("$");

        funcParts.forEach(part => {
            const matches = loadsOfFunc.filter(f =>
                ("$" + part.toLowerCase()).startsWith(f.toLowerCase())
            );
            if (matches.length > 0) {
                const longestMatch = matches.reduce((a, b) => (a.length > b.length ? a : b));
                funcs.push(longestMatch);
            }
        });

        return funcs;
    }
}

class FunctionManager {
    constructor(client) {
        this.client = client;
        this.maps = maps;
        this.functions = parser;
        this.cache = new Group();
        this.interpreter = require("../core/interpreter.js");
        this.usage = grp;

        this.cacheFunctions();
    }

    async cacheFunctions() {
        const functionEntries = Object.entries(this.maps);

        for (const func of this.functions) {
            try {
                const ogname = func.replace("$", "").replace("[", "");
                const fileEntry = functionEntries.find(([key, value]) =>
                    value.includes(ogname)
                );

                if (fileEntry) {
                    const [file] = fileEntry;
                    const funcPath = `../functions/${ogname}.js`;
                    this.cache.set(
                        ogname,
                        new Function(require(funcPath), func)
                    );
                }
            } catch (e) {
                console.error(`Failed to cache function ${func}:`, e);
            }
        }
    }

    createFunction(...ds) {
        ds.forEach(d => {
            const customFunc = new CustomFunction(d, this.client);
            this.cache.set(d.name.replace("$", ""), customFunc);
            this.functions.push(d.name);
        });
    }

    findFunctions(code = "") {
        const Functions = this.functions;
        const normalizedCode = code
            ?.replace(/\\]/g, "#LEFT#")
            .replace(/\\\[/g, "#RIGHT#")
            .replace(/\\,/g, "#COMMA#");
        const funcs = [];
        const loadsOfFunc = Functions.filter(func =>
            normalizedCode.toLowerCase().includes(func.toLowerCase())
        );
        const funcParts = normalizedCode.split("$");

        funcParts.forEach(part => {
            const matches = loadsOfFunc.filter(f =>
                ("$" + part.toLowerCase()).startsWith(f.toLowerCase())
            );
            if (matches.length > 0) {
                const longestMatch = matches.reduce((a, b) => (a.length > b.length ? a : b));
                funcs.push(longestMatch);
            }
        });

        return funcs;
    }

    serializeCode(code) {
        return code?.split("\n");
    }
}

module.exports = {
    FunctionManager,
    Function,
    CustomFunction,
    Block
};
