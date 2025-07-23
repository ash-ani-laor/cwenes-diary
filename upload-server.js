const path = require('path')

const cors = require('cors')
const express = require('express')
const multer = require('multer')

const genList = require('./scripts/gen-list.js')

function translit(str) {
  // Простой транслит (можно заменить на библиотеку, если надо умнее)
  const ru =
    'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя'
  const en =
    'ABVGDEEJZIJKLMNOPRSTUFHCCHSHSCHY_EUAabvgdeejziyklmnoprstufhcchshschy_eua'
  return str
    .split('')
    .map((l) => {
      const i = ru.indexOf(l)
      return i === -1 ? l : en[i]
    })
    .join('')
}

const app = express()
app.use(cors({ origin: 'http://localhost:8910', credentials: true }))
const upload = multer({ dest: path.join(__dirname, 'web/public/uploads') })

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' })
  // Можно переименовать файл в оригинальное имя
  const fs = require('fs')
  const originalName = req.file.originalname
  const safeName = encodeURIComponent(translit(originalName)).replace(/%/g, '')
  const newPath = path.join(req.file.destination, safeName)
  fs.renameSync(req.file.path, newPath)
  genList() // вот тут!
  res.json({ url: `/uploads/${req.file.originalname}` })
})

app.listen(9999, () =>
  console.log('Upload server started on http://localhost:9999')
)
