const pubKeys = document.querySelector('.keysHolder')
const blockHolder = document.querySelector('.blocksHolder')
var keys = []
function formatKey(type, key) {
  if (type=='public')
    return key.slice(27, -25)
}

function saveKey(pubKey, priKey) {
  keys.push(JSON.stringify({
    pubKey: pubKey,
    priKey: priKey
  }))
  localStorage.setItem('keys', JSON.stringify(keys))
}

function loadKeys() {
  console.log(keys)
  if (localStorage.getItem('keys')==null) {
    console.log("abc")
    //update()
  } else {
    console.log("Here1")
    keys = JSON.parse(localStorage.getItem('keys'))
    update()
  }
}

function checkKey() {
  const pubKey = document.querySelector('.takePubKey').value
  const priKey = document.querySelector('.takePriKey').value
  if (pubKey!='' && priKey!='') {
    console.log("here")
    for (var i=0;i<keys.length;i++) {
      var temp = JSON.parse(keys[i])
      if (temp.pubKey==pubKey) {
        console.log("work")
        document.querySelector(".pubKey").innerHTML = `<p>Public Key: ${pubKey}</p>`
        document.querySelector(".priKey").innerHTML = `<p>Private Key: ${priKey}</p>`
        saveKey(pubKey, priKey)
      }
    }
    document.getElementById("checkKey").style['border-color'] = "red"
  }
}

function update() {
  fetch('/getpubkeys', ({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }}))
    .t5678hen(res => res.json())
    .then(res => {
      for (var i=res.data.length;i>0;i--)
        pubKeys.innerHTML += `<p>${formatKey('public', res.data[i-1])}</p><hr>`
    })

  fetch('getblocks', ({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }}))
    .then(res => res.json())
    .then(res => {
      for (var i=res.data.length;i>0;i--) {
        val = JSON.parse(res.data[i-1])
        blockHolder.innerHTML += `<p>Index: ${val.index}</p><p>Timestamp: ${val.timestamp}</p><p>Hash: ${val.hash}</p><p>Public Key: ${formatKey('public', val.pubKey)}</p><hr>`
    }})}

loadKeys()
