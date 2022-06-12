"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StructureError {
    /**
     * GroupError
     */
    static GroupError(ErrorName, MethodName, ErrorMessage) {
        throw new Error(`[Group : ${ErrorName}] -> ${MethodName} : ${ErrorMessage}`);
    }
    static LimitGroupError(ErrorName, MethodName, ErrorMessage) {
        throw new Error(`[LimitGroup : ${ErrorName}] -> ${MethodName} : ${ErrorMessage}`);
    }
    static BinaryError(ErrorName, MethodName, ErrorMessage) {
        throw new Error(`[Binary : ${ErrorName}] -> ${MethodName} : ${ErrorMessage}`);
    }
}
exports.default = StructureError;
//# sourceMappingURL=StructureErrors.js.map