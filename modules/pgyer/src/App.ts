import { BuildType, COSTokenBean, COSTokenReqParams } from './types/app';
import { PgyerResponse } from './types/type';
import axios from 'axios'
import * as qs from '@wutiange/qs'
import path, { getUrl } from './path';
import FormData from 'form-data';
import np from 'path'
import fs from 'fs'

export default class App {
  private apiKey = ''
  private cosToken: COSTokenBean | null = null
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getCOSToken(params: COSTokenReqParams) {
    if (this.cosToken) {
      return this.cosToken
    }
    const body = qs.stringify(params)
    const response = await axios.post<PgyerResponse<COSTokenBean>>(getUrl(path.getCOSToken), body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': body.length
      }
    })
    this.cosToken = response.data.data
    return response.data.data
  }

  async upload(filePath: string, params?: COSTokenReqParams) {
    const fileExt = np.extname(filePath).slice(1);
    params = params || { _api_key: this.apiKey, buildType: fileExt as BuildType }
    const tokenResponse = await this.getCOSToken(params)

    const uploadUrl = tokenResponse.endpoint;
    const formData = new FormData();
    formData.append('key', tokenResponse.key);
    formData.append('file', fs.createReadStream(filePath));
    formData.append('signature', tokenResponse.params.signature);
    formData.append('x-cos-security-token', tokenResponse.params['x-cos-security-token']);
    formData.append('x-cos-meta-file-name', np.basename(filePath));
    const uploadResponse = await axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log(uploadResponse.data)
    return uploadResponse.data
  }

}