"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoiClient = exports.version = void 0;
const AoiClient_1 = require("./core/AoiClient");
Object.defineProperty(exports, "AoiClient", { enumerable: true, get: function () { return AoiClient_1.AoiClient; } });
const version = require("../package.json").version;
exports.version = version;
__exportStar(require("./core"), exports);
__exportStar(require("./events"), exports);
__exportStar(require("./structures"), exports);
__exportStar(require("./typings"), exports);
//# sourceMappingURL=index.js.map