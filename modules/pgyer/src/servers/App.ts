import { BuildType, COSTokenBean, COSTokenReqParams } from '../types';
import { PgyerResponse } from '../types';
import axios from 'axios'
import * as qs from '@wutiange/qs'
import path, { getUrl } from './path';
import FormData from 'form-data';
import np from 'path'
import fs from 'fs'
import { AxiosError } from 'axios';

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
    const url = getUrl(path.getCOSToken)
    const response = await axios.post<PgyerResponse<COSTokenBean>>(url, body, {
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
    params = Object.assign(params || {}, { _api_key: this.apiKey, buildType: fileExt as BuildType })
    const tokenResponse = await this.getCOSToken(params)

    const uploadUrl = tokenResponse.endpoint;
    const formData = new FormData();
    formData.append('signature', tokenResponse.params.signature);
    formData.append('x-cos-security-token', tokenResponse.params['x-cos-security-token']);
    formData.append('key', tokenResponse.params.key);
    formData.append('x-cos-meta-file-name', np.basename(filePath));
    formData.append('file', fs.createReadStream(filePath));
    return new Promise((resolve, reject) => {
      formData.submit(uploadUrl, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        if (res.statusCode === 204) {
          resolve('ok')
        } else {
          reject(new AxiosError('Upload Error!', res.statusCode?.toString()))
        }
      })
    })
  }

}