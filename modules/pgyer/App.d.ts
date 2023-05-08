import { COSTokenBean, COSTokenReqParams } from './types/app';
export default class App {
    private apiKey;
    constructor(apiKey: string);
    getCOSToken(params: COSTokenReqParams): Promise<COSTokenBean>;
    upload(filePath: string, params?: COSTokenReqParams): Promise<void>;
}
