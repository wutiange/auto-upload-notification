"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
class Pgyer {
    static getInstance(apiKey) {
        if (!this.instance) {
            this.instance = new Pgyer(apiKey);
            this.instance.app = new App_1.default(apiKey);
        }
        return this.instance;
    }
    constructor(apiKey) {
        this.apiKey = '';
        this.app = null;
        this.apiKey = apiKey;
    }
}
Pgyer.instance = null;
exports.default = Pgyer;
