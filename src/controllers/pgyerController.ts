import { Request, Response } from 'express'
import { AxiosError } from 'axios'
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
    res.status(500).send(error.message)
  }
}