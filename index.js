const express = require("express")
const app = express()
const port = process.env.DATABASE_PORT || 3000
const bodyParser = require("body-parser")
const response = require('./response')
const db = require("./connection")

require('dotenv').config()

app.use(bodyParser.json())

app.get("/", (req, res) => {
  response(200, 'api ready', 'success', res)
})

app.get('/pegawai', (req, res) => {
  const query = 'SELECT * FROM pegawai'
  db.query(query, (error, fields) => {
    if (error) throw response(500, 'invalid', 'error', res)
    response(200, fields, 'list pegawai muncul', res)
  })
})

app.get('/pegawai/:id', (req, res) => {
  const id = req.params.id
  const query = `SELECT * FROM pegawai WHERE id = ${id}`
  db.query(query, (error, fields) => {
    if (error) throw response(500, 'invalid', 'error', res)
    response(200, fields, 'get pegawai by id', res)
  })
})

app.post('/pegawai', (req, res) => {
  const { namaLengkap, jabatan, gaji } = req.body
  const query = `INSERT INTO pegawai (nama_lengkap, jabatan, gaji) VALUES ('${namaLengkap}', '${jabatan}', ${gaji})`
  db.query(query, (error, fields) => {
    if (error) response(500, 'invalid', 'error', res)
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId
      }
      response(200, data, 'Data Added Successfuly', res)
    }
  })
})

app.put('/pegawai', (req, res) => {
  const { id, namaLengkap, jabatan, gaji } = req.body
  const query = `UPDATE pegawai SET nama_lengkap = '${namaLengkap}', jabatan = '${jabatan}', gaji = ${gaji} WHERE id = ${id}`
  db.query(query, (error, fields) => {
    if (error) response(500, 'invalid', 'error', res)
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message
      }
      response(200, data, 'Data Updated Successfuly', res)
    } else {
      response(404, 'user not found', 'error', res)
    }
  })
})

app.delete('/pegawai', (req, res) => {
  const { id } = req.body
  const query = `DELETE FROM pegawai WHERE id = ${id}`
  db.query(query, (error, fields) => {
    if (error) response(500, 'invalid', 'error', res)
    if (fields?.affectedRows) {
      const data = {
        isDeleted: fields.affectedRows
      }
      response(200, data, 'Data Deleted Successfuly', res)
    } else {
      response(400, 'user not found', 'error', res)
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
