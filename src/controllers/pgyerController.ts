import { Request, Response } from 'express'
import axios from 'axios'
import * as qs from '@wutiange/qs'
import { COSTokenBean, COSTokenParams, PgyerResponse } from '../types/pgyer'
import Pgyer from '@wutiange/pgyer'


const pgyer = Pgyer.getInstance(process.env.PGYER_API_KEY || '')
export async function upload(req: Request, res: Response) {
  const {
    filePath,
    ...config
  } = req.body
  const updateResponse = await pgyer.app?.upload(filePath, config)

  res.send(updateResponse)
}


async function getCOSToken(params: COSTokenParams) {
  const body = qs.stringify(params)
  const response = await axios.post<PgyerResponse<COSTokenBean>>('https://www.pgyer.com/apiv2/app/getCOSToken', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length
    }
  })
  console.log(response.data.data)
  return response.data.data
}