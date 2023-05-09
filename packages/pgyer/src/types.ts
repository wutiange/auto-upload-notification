/**
* Pgyer Response Class
* @template T The type of the 'data' property
*/
export interface PgyerResponse<T> {
  /**
   * The status code of the response
   */
  code: number;

  /**
   * The message of the response
   */
  message: string;

  /**
   * The data object of the response
   */
  data: T;
}



export type BuildType = 'ios' | 'ipa' | 'android' | 'apk';
export const buildType = ['ios', 'ipa', 'android', 'apk'];

export interface COSTokenReqParams {
  _api_key: string; // (必填) API Key 点击获取_api_key
  buildType: BuildType; // (必填) 需要上传的应用类型，如果是iOS类型请传ios或ipa，如果是Android类型请传android或apk
  oversea?: number; // (选填) 是否使用海外加速上传，值为：1 使用海外加速上传，2 国内加速上传；留空根据 IP 自动判断海外加速或国内加速
  buildInstallType?: number; // (选填)应用安装方式，值为(1,2,3，默认为1 公开安装)。1：公开安装，2：密码安装，3：邀请安装
  buildPassword?: string; // (选填) 设置App安装密码，密码为空时默认公开安装
  buildDescription?: string; // (选填) 应用介绍，如没有介绍请传空字符串，或不传。
  buildUpdateDescription?: string; // (选填) 版本更新描述，请传空字符串，或不传。
  buildInstallDate?: number; // (选填)是否设置安装有效期，值为：1 设置有效时间， 2 长期有效，如果不填写不修改上一次的设置
  buildInstallStartDate?: string; // (选填)安装有效期开始时间，字符串型，如：2018-01-01
  buildInstallEndDate?: string; // (选填)安装有效期结束时间，字符串型，如：2018-12-31
  buildChannelShortcut?: string; // (选填)所需更新指定的渠道短链接，渠道短链接须为已创建成功的，并且只可指定一个渠道，字符串型，如：abcd
}

export interface COSTokenBean {
  params: COSTokenParams; // 上传文件需要的参数，包含signature、x-cos-security-token、key
  key: string; // key 上传文件存储标识唯一 key
  endpoint: string; // 上传文件的 URL
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