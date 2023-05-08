"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = void 0;
function stringify(obj) {
    const params = new URLSearchParams();
    Object.keys(obj).forEach(key => {
        params.append(key, obj[key]);
    });
    return params.toString();
}
exports.stringify = stringify;
