// scripts/gen-list.js
module.exports = function () {
  const fs = require('fs')
  const path = require('path')
  const uploadsDir = path.join(__dirname, '../web/public/uploads')
  const files = fs
    .readdirSync(uploadsDir)
    .filter((f) => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))

  const out = {
    files: files.map((f) => `/uploads/${f}`),
  }
  fs.writeFileSync(
    path.join(uploadsDir, 'list.json'),
    JSON.stringify(out, null, 2)
  )
  console.log('list.json generated!')
}
