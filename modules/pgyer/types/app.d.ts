export type BuildType = 'ios' | 'ipa' | 'android' | 'apk';
export declare const buildType: string[];
export interface COSTokenReqParams {
    _api_key: string;
    buildType: BuildType;
    oversea?: number;
    buildInstallType?: number;
    buildPassword?: string;
    buildDescription?: string;
    buildUpdateDescription?: string;
    buildInstallDate?: number;
    buildInstallStartDate?: string;
    buildInstallEndDate?: string;
    buildChannelShortcut?: string;
}
export interface COSTokenBean {
    params: COSTokenParams;
    key: string;
    endpoint: string;
}
/**
 * COS Token Bean Class
 */
export interface COSTokenParams {
    /**
     * The signature of the COS token
     */
    signature: string;
    /**
     * The security token of the COS token
     */
    'x-cos-security-token': string;
    /**
     * The key of the COS token
     */
    key: string;
}
