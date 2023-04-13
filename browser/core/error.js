export class TranspilerError extends Error {
    cause;
    constructor(msg) {
        super(msg);
        this.name = "TranspilerError";
        this.cause = this;
    }
}
//# sourceMappingURL=error.js.map