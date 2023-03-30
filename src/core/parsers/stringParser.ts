import Block from "../structs/Block.js";

export function createStringAST(text: string) {
    let block = new Block(-1, true);
    let i = 0;
    let res = "";
    const stack: number[] = [];
    while (i <= text.length) {
        if (res.includes("#FUNCTION_START#")) {
            stack.push(i - 15);
            res = text[i];
        } else if (res.includes("#FUNCTION_END#")) {
            const a = stack.pop();
            if (!a) {
                stack.push(i - 13);
            }
            res = text[i];
        } else {
            res += text[i];
        }
        i++;
    }
    if (stack.length) {
        stack;
        stack.forEach((x) => {
            text = text.substring(0, x - 1) + text.slice(x + 15, text.length);
        });
    }
    i = 0;
    res = "";
    while (i <= text.length) {
        if (res.includes("#FUNCTION_START#")) {
            const nest = new Block(block.nest.length, false, block);
            block.text = block.text.replace("#FUNCTION_START#", "");
            block.add(`#NEST_POSITION_${block.nest.length}#`);
            block.addBlock(nest);
            block = nest;
            block.add(text[i]);
            res = "";
        } else if (res.includes("#FUNCTION_END#")) {
            block.text = block.text.replace("#FUNCTION_END#", "");
            block = block.parent ? block.parent : block;
            block.add(text[i] ?? "");
            res = "";
        } else {
            res += text[i];
            block.add(text[i] ?? "");
        }
        i++;
    }
    return block;
}

export function parseString(text: string) {
    const ast = createStringAST(text);
    return ast.parse();
}

//console.log(parseString("#FUNCTION_START#__$DISCORD_DATA__#FUNCTION_END#"))
