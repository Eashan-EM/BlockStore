const pubKeys = document.querySelector('.keysHolder')
const blockHolder = document.querySelector('.blocksHolder')
const allBlocks = document.querySelector('.allblocks')
const pBlocks = document.querySelector('.pblocks')
const selectKey = document.querySelector('.addkey')
const addKey = document.querySelector('.newkey')
const getBlock = document.querySelector('.getblock')
const keyValue = document.querySelector('.keyvalue')
var currentHash = {}

var currentKey = {
  pubKey: "",
  priKey: ""
}
var keys = []
function formatKey(type, key) {
  if (type=='public')
    return key.slice(27, -25)
  else if (type=="private")
    return key.slice(38, -36)
}

function saveKey(pubKey, priKey) {
  getPubKeys().then(res => {
    for (var i=0;i<res.data.length;i++) {

      if (res.data[i]==pubKey) {
        keys.push(JSON.stringify({
        pubKey: pubKey,
        priKey: priKey
      }))
      localStorage.setItem('keys', JSON.stringify(keys))
      loadKeys()
}}})}

function loadKeys() {
  if (localStorage.getItem('keys')==null) {
    aKey()
    update()
  } else {
    keys = JSON.parse(localStorage.getItem('keys'))
    var d = JSON.parse(keys[0])
    currentKey.pubKey = d.pubKey
    currentKey.priKey = d.priKey
    document.querySelector(".pubKey").innerHTML += formatKey("public", currentKey.pubKey)
    document.querySelector(".priKey").innerHTML += formatKey("private", currentKey.priKey)
    gBlock()
    update()
  }
}

function checkKey() {
  const pubKey = document.querySelector('.takePubKey').value
  const priKey = document.querySelector('.takePriKey').value
  if (pubKey!='' && priKey!='') {
    for (var i=0;i<keys.length;i++) {
      var temp = JSON.parse(keys[i])
      if (temp.pubKey==pubKey) {
        document.querySelector(".pubKey").innerHTML = `<p>Public Key: ${pubKey}</p>`
        document.querySelector(".priKey").innerHTML = `<p>Private Key: ${priKey}</p>`
        saveKey(pubKey, priKey)
      }
    }
    document.getElementById("checkKey").style['border-color'] = "red"
  }
}

function update() {
  getPubKeys().then(res => {
    for (var i=res.data.length;i>0;i--)
    pubKeys.innerHTML += `<p>${formatKey('public', res.data[i-1])}</p><hr>`
  })
  allblocks()
}
  
function getPubKeys() {
  return fetch('/getpubkeys', ({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }}))
    .then(res => res.json())
}

function allblocks() {
  fetch('/getblocks', ({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }}))
    .then(res => res.json())
    .then(res => {
      pBlocks.style['background-color'] = "#d3d3d3"
      allBlocks.style["background-color"] = "#878787"
      allBlocks.style["border"] = "none"
      for (var i=res.data.length;i>0;i--) {
        val = JSON.parse(res.data[i-1])
        blockHolder.innerHTML += `<p>Index: ${val.index}</p><p>Timestamp: ${val.timestamp}</p><p>Hash: ${val.hash}</p><p>Public Key: ${formatKey('public', val.pubKey)}</p><hr>`
    }})
}

function pblocks() {
  fetch('/getblocks', ({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }}))
    .then(res => res.json())
    .then(res => {
      allBlocks.style["background-color"] = "#d3d3d3";
      pBlocks.style["background-color"] = "#878787"
      pBlocks.style["border"] = "none"
      blockHolder.innerHTML = ""
      for (var i=res.data.length;i>0;i--) {
        val = JSON.parse(res.data[i-1])
        if (val.pubKey==currentKey.pubKey)
          blockHolder.innerHTML += `<p>Index: ${val.index}</p><p>Timestamp: ${val.timestamp}</p><p>Hash: ${val.hash}</p><p>Public Key: ${formatKey('public', val.pubKey)}</p><hr>`
    }})
}

function formatShow(type, data) {
  var sendData = ''
  for (var i=0;i<data.keys.length;i++) {
    sendData += `
    <div class="storekeyvalue">
      <div class="keyHold">
        <p class="key">${data.keys[i]}</p>
      </div>`
    if (type=="edit") {
      sendData += `<div class="valueHold">
        <textarea id="value${i}" class="value" placeholder="Value"></textarea>
      </div>
    </div>`
    } else if (type=="show") {
      sendData += `<div class="valueHold">
        <p id="value${i}" class="value" placeholder="Value">${data.values[i]}<p>
      </div>
    </div>`
    }
  }
  return sendData
}
function sKey() {
  getBlock.style["border-radius"] = "0px 20px 0px 0px"
  selectKey.style["background-color"] = "gray"
  addKey.style["background-color"] = "#d3d3d3"
  addKey.style["border-radius"] = "0px 0px 0px 10px"
  getBlock.style["background-color"] = "#d3d3d3"
}

function aKey() {
  addKey.style["background-color"] = "gray"
  selectKey.style["background-color"] = "#d3d3d3"
  getBlock.style["background-color"] = "#d3d3d3"
  getBlock.style["border-radius"] = "0px 20px 0px 10px"
  selectKey.style["border-radius"] = "20px 0px 10px 0px"

  /*keyValue.innerHTML = formatShow("edit", {
    keys: ["Public Key", "Private Key"],
    values: []
  })

  var button = document.createElement('button')
  button.id = "addnewkey"
  button.onclick = function() {
    var pub = document.getElementById("value0").value
    var pri = document.getElementById("value1").value
    saveKey(pub, pri)
  }
  button.innerHTML = "Add Keys"
  keyValue.appendChild(button)*/

  keyValue.innerHTML = formatShow("edit", {
    keys: ["Name", "Email", "Phone No.", "Blood Group", "Age", "Gender"]
  })
  var button = document.createElement('button')
  button.id = "registerbutton"
  button.onclick = function() {
    const p_name = document.querySelector('#value0')
    const p_email = document.querySelector('#value1')
    const p_pho = document.querySelector('#value2')
    const p_bg = document.querySelector('#value3')
    const p_age = document.querySelector('#value4')
    const p_gender = document.querySelector('#value5')
    fetch('/register', ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        key: ["Name", "Email Address", "Phone No", "Blood Group", "Age", "Gender"],
        value: [p_name.value, p_email.value, p_pho.value, p_bg.value, p_age.value, p_gender.value]
      })
    }))
      .then(res => res.json())
      .then(data => {
        console.log(data)
        saveKey(data.pubKey, data.priKey)
      })
  }
  button.innerHTML = "Register"
  keyValue.appendChild(button)
}

function gBlock() {
  selectKey.style["border-radius"] = "20px 0px 0px 0px"
  getBlock.style["background-color"] = "gray"
  addKey.style["background-color"] = "#d3d3d3"
  addKey.style["border-radius"] = "0px 0px 10px 0px"
  selectKey.style["background-color"] = "#d3d3d3"

  keyValue.innerHTML = formatShow("edit", {
    keys: ["Block Hash"],
    values: []
  })
  var button = document.createElement('button')
  button.id = "sendButton"
  button.onclick = function() {
    const h = document.querySelector("#value0").value
    fetch('/getblock', ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        blockHash: h,
        privateKey: currentKey.priKey
      })
    }))
      .then(res => res.json())
      .then(data => {
        var d = JSON.parse(data.data)
        keyValue.innerHTML = formatShow("show", {
          keys: d.key,
          values: d.value
        })
        currentHash = d
        var button2 = document.createElement('button')
        button2.id = "editButton"
        button2.onclick = function() {
          console.log(currentHash.hash)
          keyValue.innerHTML = formatShow() 
        }
        button2.innerHTML = "Edit Information"
        keyValue.appendChild(button2)
      })
  }
  button.innerHTML = "Get Block Data"
  keyValue.appendChild(button)
}

loadKeys()
