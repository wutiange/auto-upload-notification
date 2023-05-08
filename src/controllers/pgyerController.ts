import { Request, Response } from 'express'
import axios, { AxiosError } from 'axios'
import * as qs from '@wutiange/qs'
import { COSTokenBean, COSTokenParams, PgyerResponse } from '../types/pgyer'
import Pgyer from '@wutiange/pgyer'


const pgyer = Pgyer.getInstance(process.env.PGYER_API_KEY || '')
export async function upload(req: Request, res: Response) {
  try {
    const {
      filePath,
      ...config
    } = req.body
    const updateResponse = await pgyer.app?.upload(filePath, config)
    res.send(updateResponse)
  } catch (err) {
    const error = err as AxiosError
    console.log(error.message, '-----error.message-----', error)
    res.status(500).send(error.message)
  }
}