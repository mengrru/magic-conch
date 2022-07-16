;(function () {
  const Dataset = document.currentScript.dataset
  const Config = {
    snow: Dataset.snow ? Dataset.snow.split(',') : ['❄', '※'],
    color: Dataset.color || '#d9e2e7',
    speed: Dataset.speed ? parseInt(Dataset.speed, 10) : 10,
    dom: document.getElementsByTagName('body')[0],
    interval: Dataset.interval ? parseInt(Dataset.interval, 10) : 1000,
    num: Dataset.num ? parseInt(Dataset.num, 10) : 1
  }
  const $canvas = document.createElement('div')

  useStyle($canvas, {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 100
  })

  setInterval(() => {
    for (let i = 0; i < Config.num; i++) {
      genSnow()
    }
  }, Config.interval)

  function genSnow () {
    const $snow = document.createElement('div')
    const Z = rand(2, 5) * 0.3
    $snow.innerText = Config.snow[rand(0, Config.snow.length - 1)]
    useStyle($snow, {
      display: 'inline-block',
      color: Config.color,
      fontSize: rand(18, 24) * Z + 'px',
      position: 'absolute',
      top: 0,
      left: rand(0, 100) + '%',
      transition: 'transform ' + Config.speed / (Z * 0.8) + 's linear' + ',opacity ' + Config.speed / (Z * 0.8) + 's linear',
      transform: 'translateY(-100%)',
      opacity: Math.random() * Z + (0.3 * Z)
    })
    setTimeout(() => {
      useStyle($snow, {
        transform: 'translate(0, ' + getComputedStyle($canvas).height + ') rotate(480deg)',
        opacity: 0
      })
      $snow.addEventListener('transitionend', () => {
        $snow.remove()
      })
    }, 100)
    $canvas.appendChild($snow)
  }

  function rand (from, to) {
    return from + Math.floor(Math.random() * (to - from + 1))
  }
  function useStyle (dom, style) {
    for (let sKey in style) {
      dom.style[sKey] = style[sKey]
    }
  }

  Config.dom.appendChild($canvas)
})()
