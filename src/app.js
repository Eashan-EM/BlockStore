const express = require('express')
const crypto = require('crypto')
const path = require('path')
const cors = require('cors')
const bc = require('./blocks.js')

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, './public')))
app.use(express.urlencoded({ extended: true }));

app.listen(port, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", port);
})

app.get('/', async(req, res) => {
  res.sendFile(path.join(__dirname, '../src/public/index.html')) 
})

app.post("/getblock", (req, res) => {
  if (bc.blockExists(req.body.blockHash)) {
    var priKey = req.body.privateKey.replace(/\\n/g, '\n')
    var response = bc.getBlock(req.body.blockHash, priKey)
    res.send(response)
  }
})

app.get("/newregister", (req, res) => {
  res.sendFile(path.join(__dirname, '../src/public/pregis.html'))
})

app.post("/register", (req, res) => {
  const keyPair = bc.createKeyPair()
  var data = JSON.stringify(req.body);
  var hash = bc.newBlock(data, keyPair.publicKey)
  console.log(keyPair.privateKey)
  res.send(JSON.stringify({
    hash: hash,
    pubKey: keyPair.publicKey,
    priKey: keyPair.privateKey
  }))
})
