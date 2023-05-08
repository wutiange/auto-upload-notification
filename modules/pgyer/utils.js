"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkApiKey = void 0;
function checkApiKey(apiKey) {
    if (!apiKey) {
        throw new Error('请先配置apiKey');
    }
}
exports.checkApiKey = checkApiKey;
