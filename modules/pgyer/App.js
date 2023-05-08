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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const qs = __importStar(require("@wutiange/qs"));
const path_1 = __importStar(require("./path"));
const form_data_1 = __importDefault(require("form-data"));
const path_2 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class App {
    constructor(apiKey) {
        this.apiKey = '';
        this.apiKey = apiKey;
    }
    async getCOSToken(params) {
        const body = qs.stringify(params);
        const response = await axios_1.default.post((0, path_1.getUrl)(path_1.default.getCOSToken), body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': body.length
            }
        });
        return response.data.data;
    }
    async upload(filePath, params) {
        const fileExt = path_2.default.extname(filePath).slice(1);
        params = params || { _api_key: this.apiKey, buildType: fileExt };
        const tokenResponse = await this.getCOSToken(params);
        const uploadUrl = tokenResponse.endpoint;
        const formData = new form_data_1.default();
        formData.append('key', tokenResponse.key);
        formData.append('file', fs_1.default.createReadStream(filePath));
        formData.append('signature', tokenResponse.params.signature);
        formData.append('x-cos-security-token', tokenResponse.params['x-cos-security-token']);
        formData.append('x-cos-meta-file-name', path_2.default.basename(filePath));
        const uploadResponse = await axios_1.default.post(uploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(uploadResponse.data);
    }
}
exports.default = App;
