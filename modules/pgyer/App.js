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
const axios_2 = require("axios");
class App {
    constructor(apiKey) {
        this.apiKey = '';
        this.cosToken = null;
        this.apiKey = apiKey;
    }
    async getCOSToken(params) {
        if (this.cosToken) {
            console.log(this.cosToken, '------this.cosToken-----');
            return this.cosToken;
        }
        const body = qs.stringify(params);
        console.log(body, '-----body-----');
        const url = (0, path_1.getUrl)(path_1.default.getCOSToken);
        console.log(url, '-----url-----');
        const response = await axios_1.default.post(url, body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': body.length
            }
        });
        this.cosToken = response.data.data;
        console.log(response.data.data);
        return response.data.data;
    }
    async upload(filePath, params) {
        const fileExt = path_2.default.extname(filePath).slice(1);
        params = Object.assign(params || {}, { _api_key: this.apiKey, buildType: fileExt });
        const tokenResponse = await this.getCOSToken(params);
        const uploadUrl = tokenResponse.endpoint;
        const formData = new form_data_1.default();
        formData.append('signature', tokenResponse.params.signature);
        formData.append('x-cos-security-token', tokenResponse.params['x-cos-security-token']);
        formData.append('key', tokenResponse.params.key);
        formData.append('x-cos-meta-file-name', path_2.default.basename(filePath));
        formData.append('file', fs_1.default.createReadStream(filePath));
        console.log(filePath.replace(/^.*[\\\/]/, '') === path_2.default.basename(filePath), '----==filePath..=======');
        return new Promise((resolve, reject) => {
            formData.submit(uploadUrl, (err, res) => {
                if (err) {
                    console.log(err, '-----err-----');
                    reject(err);
                    return;
                }
                if (res.statusCode === 204) {
                    resolve('ok');
                }
                else {
                    console.log(res.statusMessage, '-----res.statusMessage-----');
                    reject(new axios_2.AxiosError('Upload Error!', res.statusCode?.toString()));
                }
            });
        });
    }
}
exports.default = App;
