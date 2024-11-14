const { createHash } = require('crypto');
const crypto = require('crypto')
const fs = require('fs')

class Block {
  constructor (index, timestamp, data, previousHash, hash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
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
    return createHash('sha256').update(toHash).digest('base64');
  }

  save() {
    return JSON.stringify({
      index: this.index,
      timestamp: this.timestamp,
      data: this.data,
      previousHash: this.previousHash,
      hash: this.hash
    })
  }
}

class BlockChain {
  constructor () {
    this.chain = []
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
          parse.previousHash,
          parse.hash))
        this.index++
      }
    } else {
      this.chain.push(new Block(0, Date.now().toString(), "genesis", 0, ''))
      this.bc = []
      this.index++;
      this.save()
  }}

  newBlock(data, pubKey) {
    var block = new Block(
      this.chain.length,
      Date.now().toString(),
      this.encrypt(data, pubKey),
      this.chain[this.index-1].hash,
      '')
    this.chain.push(block)
    this.index++;
    this.save()
    return this.chain[this.index-1].hash
  }
  blockExists(hash) {
    for (var i=0;i<this.index;i++) {
      var b = this.chain[i]
      console.log(b.hash)
      console.log(hash)
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
          sendData.data += crypto.privateDecrypt(priKey, Buffer.from(b.data[j]))
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

  save() {
    for (var i=0;i<this.index;i++) {
      this.bc[i] = this.chain[i].save()
    }
    fs.writeFile('blockchain', JSON.stringify({bc: this.bc}), ()=>{})
  }
}

const blockchain = new BlockChain()
module.exports = blockchain