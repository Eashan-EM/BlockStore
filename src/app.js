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

app.get("/newkey", (req, res) => {
  res.sendFile(path.join(__dirname, '../src/public/pregis.html'))
})

app.post("/registerKey", (req, res) => {
  const keyPair = crypto.generateKeyPairSync('rsa', { 
        modulusLength: 520, 
        publicKeyEncoding: { 
            type: 'spki', 
            format: 'pem'
        }, 
        privateKeyEncoding: { 
        type: 'pkcs8', 
        format: 'pem', 
        cipher: 'aes-256-cbc', 
        passphrase: Date.now().toString()
        } 
    });
  var data = JSON.stringify({
    key: ["Name", "Email Address", "Phone No", "Blood Group", "Age", "Gender"],
    value: [req.body.pname, req.body.pemail, req.body.pno, req.body.pbg, req.body.page, req.body.pgender]
  })
  var hash = bc.newBlock(data, keyPair.publicKey)
  res.send(JSON.stringify({
    hash: hash,
    pubKey: keyPair.publicKey,
    priKey: keyPair.privateKey
  }))
})
