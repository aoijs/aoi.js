const { Group } = require("./structures/dist");
const { functions: parser, maps, grp } = require("../functions/AoiReader.js");
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
        this.params = d.params;
        this.functions =
            this.type === "aoi.js" ? this.serializeFunctions() : undefined;
    }

    serializeFunctions() {
        let Functions = this.client.functionManager.functions;
        let code = this.code
            ?.replace(/\\]/g, "#LEFT#")
            .split("\\[")
            .join("#RIGHT#")
            .replace("\\,", "#COMMA#");
        let funcs = [];
        let loadsOfFunc = Functions.filter((thatfunc) =>
            code.toLowerCase().includes(thatfunc.toLowerCase()),
        );
        const funcyboys = code.split("$");
        for (const funcboy of funcyboys) {
            let Func = loadsOfFunc.filter(
                (f) =>
                    f.toLowerCase() ===
                    ("$" + funcboy.toLowerCase()).slice(0, f.length),
            );
            if (!Func.length) {
                continue;
            }
            if (Func.length === 1) {
                funcs.push(Func[0]);
            } else if (Func.length > 1) {
                funcs.push(Func.sort((a, b) => b.length - a.length)[0]);
            }
        }
        return funcs;
    }
}

class FunctionManager {
    constructor(client) {
        this.client = client;
        this.maps = maps;
        this.functions = /*Object.keys(parser)*/ parser;
        this.cache = new Group();
        this.cacheFunctions();
        this.interpreter = require("../interpreter.js");
        this.usage = grp;
    }

    async cacheFunctions() {
        for (const func of this.functions) {
            try {
                const ogname = func.replace("$", "").replace("[", "");
                //this.cache.set(ogname, new Function(require('../functions/funcs/'+ogname+'.js'),func))
                const file = Object.entries(this.maps).find((y) =>
                    y[1].includes(ogname),
                )?.[0];
                if (!file) continue;
                else {
                    this.cache.set(
                        ogname,
                        new Function(
                            require(`../functions/Funcs/${file}/${ogname}.js`),
                            func,
                        ),
                    );
                }
            } catch (e) {
                console.error(e);
                continue;
            }
        }
    }

    createFunction(...ds) {
        for (const d of ds) {
            this.cache.set(
                d.name.replace("$", ""),
                new CustomFunction(d, this.client),
            );
            this.functions.push(d.name);
        }
    }

    findFunctions(code = "") {
        let Functions = this.functions;
        code = code
            ?.replace(/\\]/g, "#LEFT#")
            .split("\\[")
            .join("#RIGHT#")
            .replace("\\,", "#COMMA#");
        let funcs = [];
        let loadsOfFunc = Functions.filter((thatfunc) =>
            code.toLowerCase().includes(thatfunc.toLowerCase()),
        );
        const funcyboys = code.split("$");
        for (const funcboy of funcyboys) {
            let Func = loadsOfFunc.filter(
                (f) =>
                    f.toLowerCase() ===
                    ("$" + funcboy.toLowerCase()).slice(0, f.length),
            );
            if (!Func.length) {
                continue;
            }
            if (Func.length === 1) {
                funcs.push(Func[0]);
            } else if (Func.length > 1) {
                funcs.push(Func.sort((a, b) => b.length - a.length)[0]);
            }
        }
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
};
