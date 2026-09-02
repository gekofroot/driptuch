
// variables
let outerField = document.getElementById('outer-field')
let playspaceLink = document.getElementById('playspace-link')

let title = [ 
  'D', 'r',
  'i', 'p', 
  't', 'u',
  'c', 'h'
]

let zCount = title.length + 1
function dropLetter(countValue, zValue) {
  let topPosition = Math.round(Math.random() * 100)
  if (topPosition <= 6 || topPosition >= 80) {
    while (topPosition <= 6 || topPosition >= 80) {
      topPosition = Math.round(Math.random() * 100)
    }
  }
  let leftPosition = Math.round(Math.random() * 100)
  if (leftPosition <= 6 || leftPosition >= 80) {
    while (leftPosition <= 6 || leftPosition >= 80) {
      leftPosition = Math.round(Math.random() * 100)
    }
  }
  let newNode = document.createElement('div')
  newNode.setAttribute('class', 'letter-item')
  newNode.setAttribute('id', `letter-${countValue}`)
  newNode.style.top = `${topPosition}%`
  newNode.style.left = `${leftPosition}%`
  newNode.style.position = 'absolute'
  newNode.style.zIndex = `${zValue}`
  newNode.innerText = `${title[countValue]}`
  outerField.appendChild(newNode)
  setTimeout(()=> {
    newNode.style.opacity = '100'
  }, 500)
}

let dripCount = 0
setTimeout(()=> {
  let dripInterval = setInterval(()=> {
    if (dripCount === title.length) {
      clearInterval(dripInterval)
    } else {
      dropLetter(dripCount, zCount)
      dripCount += 1
      zCount -= 1
    }
  }, 500)
}, 100)

let touchCount = 0
outerField.addEventListener('click', ()=> {
  let eventTarget = event.target
  if (eventTarget.id.includes('letter') && eventTarget.id.includes(touchCount)) {
    eventTarget.style.opacity = '0'
    eventTarget.style.transition = '.2s'
    setTimeout(()=> {
      eventTarget.style.display = 'none'
    }, 300)
    touchCount += 1
    console.log(touchCount)
    if (touchCount === 8) {
      setTimeout(()=> {
	console.log('...')
	playspaceLink.click()
      }, 1000)
    }
  }
})

