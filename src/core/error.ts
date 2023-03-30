export class TranspilerError extends Error {
    cause: TranspilerError;
    constructor(msg: string) {
        super(msg);
        this.name = "TranspilerError";
        this.cause = this;
    }
}
