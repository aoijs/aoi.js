export class TranspilerError extends Error {
    cause: TranspilerError;
    function?: { name: string; code: string };
    cmd?: string;
    path?: string;
    code: string | undefined;
    constructor(
        msg: string,
        data?: {
            function?: {
                name: string;
                code: string;
            };
            cmd?: string;
            path?: string;
            code?: string;
        },
    ) {
        super(msg);
        this.name = "TranspilerError";
        this.cause = this;
        this.function = data?.function;
        this.cmd = data?.cmd;
        this.path = data?.path;
        this.code = data?.code;
    }

    toString() {
        return `TranspilerError: ${this.message} {
${
    this.function
        ? `function: {
    name: ${this.function.name}
    code: ${this.function.code.trim()}
}`
        : ""
}${this.cmd ? `cmd: ${this.cmd}` : ""}${
    this.path ? `path: ${this.path}` : ""
}${this.code ? `code: ${this.code}` : ""}
}`;
    }
}
