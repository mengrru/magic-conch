;(function () {
let Data = {}
let Rest = []
let CurType = 'all'

function init (data) {
  Data = data
  update('all')
  Object.keys(Data).forEach(t => {
    const e = document.createElement('option')
    e.value = t
    e.innerText = Data[t].name
    $typeSelect.append(e)
  })
}

const $iframe = document.getElementById('viewer')
const $btnStart = document.getElementById('btn-start')
const $urlDisplay = document.getElementById('url-display')
const $typeSelect = document.getElementById('type-select')

$typeSelect.onchange = function (e) {
  update(e.target.value)
}

$btnStart.onclick = function () {
  const url = fetchOne()
  $iframe.src = url
  $urlDisplay.innerText = url
  $urlDisplay.href = url
}

function update (type) {
  CurType = type
  Rest = type === 'all'
    ? Object.keys(Data).reduce((p, n) => p.concat(Data[n].items), [])
    : Data[type].items.slice()
}

function fetchOne () {
  if (!Rest.length) {
    update(CurType)
  }
  const i = rand(Rest.length)
  return Rest.splice(i, 1)
}

function rand (n) {
  return Math.floor(Math.random() * n)
}

window.Surf = {
  init
}

})()
