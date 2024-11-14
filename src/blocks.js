const { createHash } = require('crypto');
const crypto = require('crypto')
const fs = require('fs')

class Block {
  constructor (index, timestamp, data, pubKey, previousHash, hash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.pubKey = pubKey
    this.previousHash = previousHash;
    this.hash = this.calcHash()
    if (hash != '') {
      this.hash = hash
    } else {
      this.hash = this.calcHash()
    }
  }
  calcHash() {
    var toHash = this.index + this.timestamp + this.data + this.previousHash
    return createHash('sha1').update(toHash).digest('base64');
  }

  save() {
    return JSON.stringify({
      index: this.index,
      timestamp: this.timestamp,
      data: this.data,
      pubKey: this.pubKey,
      previousHash: this.previousHash,
      hash: this.hash
    })
  }
}

class BlockChain {
  constructor () {
    this.chain = []
    this.pubKeys = []
    this.index = 0
    if (fs.existsSync('blockchain')) {
      var contents = fs.readFileSync('blockchain')
      var parsed = JSON.parse(contents)
      this.bc = parsed.bc
      var parse = JSON.parse(this.bc[0])
      for (var i=0;i<this.bc.length;i++) {
        parse = JSON.parse(this.bc[i])
        this.chain.push(new Block(
          parse.index,
          parse.timestamp,
          parse.data,
          parse.pubKey,
          parse.previousHash,
          parse.hash))
        if (!this.pubKeys.includes(parse.pubKey))
          this.pubKeys.push(parse.pubKey)
        this.index++
      }
    } else {
      var key = this.createKeyPair()
      this.chain.push(new Block(0, Date.now().toString(), "genesis",key.publicKey, 0, ''))
      this.pubKeys.push(key.publicKey)
      this.bc = []
      this.index++;
      this.save()
  }}

  getPubKeys() {
    return JSON.stringify({
      data: this.pubKeys,
      err: ""
    })
  }

  getBlocks() {
    return JSON.stringify({
      data: this.bc,
      err: ""
    })
  }

  newBlock(data, pubKey) {
    var block = new Block(
      this.index,
      Date.now().toString(),
      this.encrypt(data, pubKey),
      pubKey,
      this.chain[this.index-1].hash,
      '')
    if (!this.pubKeys.includes(pubKey))
      this.pubKeys.push(pubKey)
    this.chain.push(block)
    this.index++;
    this.save()
    return this.chain[this.index-1].hash
  }

  blockExists(hash) {
    for (var i=0;i<this.index;i++) {
      var b = this.chain[i]
      if (b.hash == hash) {
        return true
      }
    }
    return false
  }

  getBlock(hash, priKey) {
    var sendData = {}
    for (var i=0;i<this.index;i++) {
      var b = this.chain[i]
      if (b.hash == hash) {
        sendData.index = b.index
        sendData.timestamp = b.timestamp
        sendData.data = ""
        sendData.previousHash = b.previousHash
        sendData.hash = b.hash
        for (var j=0;j<b.data.length;j++) {
          sendData.data += crypto.privateDecrypt({key:priKey,passphrase:''}, Buffer.from(b.data[j])).toString("utf-8")
        }
        return JSON.stringify(sendData)
    }
  }}

  encrypt(data, pubKey) {
    var response = data.match(/.{1,20}/g)
    for (var i=0;i<response.length;i++) {
      response[i] = crypto.publicEncrypt(pubKey, response[i])
    }
    return response
  }

  createKeyPair() {
    return crypto.generateKeyPairSync('rsa', { 
        modulusLength: 520, 
        publicKeyEncoding: { 
            type: 'spki', 
            format: 'pem'
        }, 
        privateKeyEncoding: { 
        type: 'pkcs8', 
        format: 'pem', 
        cipher: 'aes-256-cbc', 
        passphrase: ''
        } 
    });

  }

  save() {
    for (var i=0;i<this.index;i++) {
      this.bc[i] = this.chain[i].save()
    }
    fs.writeFile('blockchain', JSON.stringify({bc: this.bc}), ()=>{})
  }
}

const blockchain = new BlockChain()
module.exports = blockchain
