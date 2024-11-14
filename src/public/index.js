const pubKeys = document.querySelector('.keysHolder')
const blockHolder = document.querySelector('.blocksHolder')

function formatKey(type, key) {
  if (type=='public')
    return key.slice(27, -25)
}

function update() {
  fetch('/getpubkeys', ({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }}))
    .then(res => res.json())
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
update()
