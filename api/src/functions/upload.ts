// api/src/functions/upload.ts
import fs from 'fs'
import path from 'path'

import type { APIGatewayEvent, Context } from 'aws-lambda'
import multiparty from 'multiparty'

// Redwood Lambda proxy превращает тело в base64
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  // Гарантируем, что uploads существует
  const uploadsDir = path.join(process.cwd(), '../web/public/uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  // Проверяем наличие данных
  if (!event.body || !event.headers['content-type']) {
    return { statusCode: 400, body: 'No file or content-type' }
  }

  // Создаём псевдо-объект req для multiparty
  const boundary = event.headers['content-type'].split('boundary=')[1]
  if (!boundary) {
    return { statusCode: 400, body: 'No boundary in content-type' }
  }

  // multiparty ждёт поток, поэтому эмулируем stream
  const buffer = Buffer.from(event.body, 'base64')
  const Readable = require('stream').Readable
  const req = new Readable()
  req.push(buffer)
  req.push(null)
  req.headers = event.headers

  const form = new multiparty.Form()

  return new Promise((resolve) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        resolve({ statusCode: 500, body: 'Upload error: ' + err })
        return
      }
      const file = files.file?.[0]
      if (!file) {
        resolve({ statusCode: 400, body: 'No file uploaded' })
        return
      }
      const filename =
        Date.now() + '-' + file.originalFilename.replace(/[^\w.-]+/g, '_')
      const targetPath = path.join(uploadsDir, filename)
      fs.copyFileSync(file.path, targetPath)
      resolve({
        statusCode: 200,
        body: JSON.stringify({ url: `/uploads/${filename}` }),
      })
    })
  })
}
