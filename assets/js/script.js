
// variables
let menu = document.getElementById('menu')
let menuPanel = document.getElementById('menu-panel')
let themeSelect = document.getElementById('theme-select')
let mainField = document.getElementById('main-field')
let play = document.getElementById('play')
let fillShader = document.getElementById('fill-shader')
let highScoreDisplay = document.getElementById('high-score-display')
let pointsDisplay = document.getElementById('points-display')
let dropletsDisplay = document.getElementById('droplets-display')
let orbField = document.getElementById('orb-field')
let boosterField = document.getElementById('booster-field')

let mainFieldWidth = mainField.offsetWidth
let mainFieldHeight = mainField.offsetHeight
let gameFlag = 0
let dripSpeed = 700
let droplets = 0
let points = 0
let highScore = 0
let currentCount = 0
let orbCount = 7
let boosterCount = 0
let streamCount = 0

// stored values
let storedPoints = localStorage.getItem('points')
let storedHighScore = localStorage.getItem('high-score')
let storedDroplets = localStorage.getItem('droplets')
let storedCurrentCount = localStorage.getItem('current-count')
let storedOrbCount = localStorage.getItem('orb-count')
let storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: light)").matches ? "dark" : "light")


// retrieve stored values
function retrieveStore(storedItem, item, itemDisplay = '') {
  if (storedItem) {
    item = storedItem
    itemDisplay.innerHTML = item
  } else {
    itemDisplay.innerHTML = item
  }
}
retrieveStore(storedOrbCount, orbCount)
retrieveStore(storedCurrentCount, currentCount)
retrieveStore(storedHighScore, highScore, highScoreDisplay)
retrieveStore(storedPoints, points, pointsDisplay)
retrieveStore(storedDroplets, droplets, dropletsDisplay)

if (storedTheme) {
  document.documentElement.setAttribute("data-theme", storedTheme)
  themeSelect.value = storedTheme
} else {
  document.documentElement.setAttribute("data-theme", 'Peachy')
  localStorage.setItem('theme', 'Peachy')
  themeSelect.value = 'Peachy'
}

// build orb field
for (let x = 0; x < 7; x++) {
  let orbItem = document.createElement('div')
  orbItem.setAttribute('class', 'orb-item')
  orbField.appendChild(orbItem)
}

for (let x = 0; x < orbField.children.length; x++) {
  orbField.children[x].style.background = 'var(--orb-inactive)'
}

// build booster field
for (let x = 0; x < 4; x++) {
  let orbItem = document.createElement('div')
  orbItem.setAttribute('class', 'booster-item')
  boosterField.appendChild(orbItem)
}
for (let x = 0; x < boosterField.children.length; x++) {
  boosterField.children[x].style.background = 'var(--booster-inactive)'
}

// generate droplet position
function generateDropletPos(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

// build droplets
let dropletInterval = ''
function dropletDrip() {

  // droplet interval function
  dropletInterval = setInterval(() => {
    if (mainField.children.length > 14) {

      // game loop inactive
      gameFlag = 0

      // append shader node
      let shaderNode = document.createElement('div')
      shaderNode.setAttribute('id', 'main-field-shader')
      shaderNode.setAttribute('class', 'main-field-shader')
      mainField.appendChild(shaderNode)

      // display play
      play.style.display = 'flex'
      setTimeout(() => {
	play.style.opacity = '100'
	clearInterval(dropletInterval)
      }, 1000)
    } else {

      // game loop active
      // position droplet x, y values on field
      let dropletLeft = generateDropletPos(30, mainFieldWidth)
      if (dropletLeft >= (mainFieldWidth - 70)) {
	while (dropletLeft >= (mainFieldWidth - dropletLeft)) {
	  dropletLeft = generateDropletPos(30, mainFieldWidth)
	}
      }
      let dropletTop = generateDropletPos(30, mainFieldHeight)
      if (dropletTop >= (mainFieldHeight - 70)) {
	while (dropletTop >= (mainFieldHeight - dropletTop)) {
	  dropletTop = generateDropletPos(30, mainFieldHeight)
	}
      }

      // create droplet
      // assemble droplet attributes
      let newDroplet = document.createElement('button')
      newDroplet.setAttribute('id', `droplet-${droplets}`)
      newDroplet.setAttribute('class', 'droplet')
      newDroplet.style.left = `${dropletLeft}px`
      newDroplet.style.top = `${dropletTop}px`

      // drip droplet to main field
      mainField.appendChild(newDroplet)
      droplets += 1
      dropletsDisplay.innerHTML = droplets
      localStorage.setItem('droplets', droplets)
    }
  }, dripSpeed)
}

// modify drip speed
// decrement drip speed
function prevDrip(currentCountDrop) {
  currentCount -= currentCountdrop
  clearInterval(dropletInterval)
  dropletDrip()
}

// increment drip speed
function nextDrip(dripSpeedValue) {
  dripSpeed = dripSpeedValue
  clearInterval(dropletInterval)
  dropletDrip()
}

// play engaged
play.addEventListener('click', () => {
  event.stopPropagation()
  play.style.transform = 'translateY(10px)'
  setTimeout(() => {
    let fillShaderCount = 0
    let fillShaderInterval = setInterval(() => {
      if (fillShaderCount > 100) {
	play.style.opacity = '0'
	clearInterval(fillShaderInterval)
      } else {
	fillShader.style.height = `${fillShaderCount}%`
	fillShaderCount += 1
      }
    }, 1)
  }, 200)
  
  // initialise values
  streamCount = 0
  boosterCount = 0
  orbCount = 7
  localStorage.setItem('orb-count', orbCount)
  currentCount = 0
  localStorage.setItem('current-count', currentCount)
  dripSpeed = 700
  points = 0
  pointsDisplay.innerHTML = points
  localStorage.setItem('points', points)
  while (mainField.childNodes.length > 0) {
    mainField.removeChild(mainField.firstChild)
  }
  droplets = 0
  dropletsDisplay.innerHTML = droplets
  localStorage.setItem('droplets', droplets)
  gameFlag = 1
  setTimeout(() => {

    // game loop active
    for (let x = 0; x < orbField.children.length; x++) {
      orbField.children[x].style.background = 'var(--orb-inactive)'
    }
    for (let x = 0; x < orbCount; x++) {
      orbField.children[x].style.background = 'var(--orb-active)'
    }
    for (let x = 0; x < boosterField.children.length; x++) {
      boosterField.children[x].style.background = 'var(--booster-inactive)'
    }
    for (let x = 0; x < boosterCount; x++) {
      boosterField.children[x].style.background = 'var(--booster-active)'
    }
    play.style.display = 'none'
    play.style.transform = 'translateY(0px)'
    fillShader.style.height = '0'

    // commence rain
    dropletDrip()
  }, 800)
})

// main field engaged
mainField.addEventListener('click', () => {
  let eventTarget = event.target
  if (gameFlag === 1) {
    
    // game active
    if (eventTarget.className === 'droplet') {

      // droplet touched
      streamCount += 1
      if (streamCount % 30 === 0) {
	boosterCount += 1
      }
      if (boosterCount % 2 === 0) {
	prevDrip(50)
      }
      for (let x = 0; x < boosterField.children.length; x++) {
	boosterField.children[x].style.background = 'var(--booster-inactive)'
      }
      for (let x = 0; x < boosterCount; x++) {
	boosterField.children[x].style.background = 'var(--booster-active)'
      }
      if (boosterCount === 0) {
	points += 1
      } else if (boosterCount === 1) {
	points += 2
      } else if (boosterCount === 2) {
	points += 3
      } else if (boosterCount === 4) {
	points += 5
      }
      pointsDisplay.innerHTML = points
      localStorage.setItem('points', points)
      if (points > highScore) {
	highScore = points
	highScoreDisplay.innerHTML = highScore
	localStorage.setItem('high-score', highScore)
      }
      droplets -= 1
      dropletsDisplay.innerHTML = droplets
      localStorage.setItem('droplets', droplets)
      mainField.removeChild(eventTarget)
    } else {

      // droplet not touched
      streamCount = 0
      boosterCount = 0
      for (let x = 0; x < boosterField.children.length; x++) {
	boosterField.children[x].style.background = 'var(--booster-inactive)'
      }
      for (let x = 0; x < boosterCount; x++) {
	boosterField.children[x].style.background = 'var(--booster-active)'
      }
      orbCount -= 1
      localStorage.setItem('orb-count', orbCount)
      for (let x = 0; x < orbField.children.length; x++) {
	orbField.children[x].style.background = 'var(--orb-inactive)'
      }

      for (let x = 0; x < orbCount; x++) {
	orbField.children[x].style.background = 'var(--orb-active)'
      }
      
      if (points > 0) {
	if (orbCount < 1) {
	  points -= 1
	}
      }
      pointsDisplay.innerHTML = points
      localStorage.setItem('points', points)
    }
  }
  currentCount += 1
  localStorage.setItem('current-count', currentCount)
  if (currentCount >= 0 && currentCount < 10) {
    nextDrip(700)
  } else if (currentCount >= 10 && currentCount < 20) {
    nextDrip(600)
  } else if (currentCount >= 20 && currentCount < 30) {
    nextDrip(500)
  } else if (currentCount >= 30 && currentCount < 40) {
    nextDrip(400)
  } else if (currentCount >= 40 && currentCount < 50) {
    nextDrip(300)
  } else if (currentCount >= 50 && currentCount < 65) {
    nextDrip(200)
  } else if (currentCount >= 65 && currentCount < 80) {
    nextDrip(190)
  } else if (currentCount >= 80 && currentCount < 95) {
    nextDrip(180)
  } else if (currentCount >= 95 && currentCount < 110) {
    nextDrip(170)
  } else if (currentCount >= 110 && currentCount < 125) {
    nextDrip(160)
  } else if (currentCount >= 125 && currentCount < 155) {
    nextDrip(150)
  } else if (currentCount >= 155 && currentCount < 185) {
    nextDrip(140)
  } else if (currentCount >= 185 && currentCount < 215) {
    nextDrip(130)
  } else if (currentCount >= 215 && currentCount < 245) {
    nextDrip(120)
  } else if (currentCount >= 245 && currentCount < 275) {
    nextDrip(110)
  } else if (currentCount >= 275 && currentCount < 320) {
    nextDrip(100)
  } else if (currentCount >= 320 && currentCount < 365) {
    nextDrip(95)
  } else if (currentCount >= 365 && currentCount < 410) {
    nextDrip(90)
  } else if (currentCount >= 410 && currentCount < 455) {
    nextDrip(85)
  } else if (currentCount >= 455 && currentCount < 500) {
    nextDrip(80)
  } else if (currentCount >= 500 && currentCount < 550) {
    nextDrip(75)
  } else if (currentCount >= 550 && currentCount < 600) {
    nextDrip(70)
  } else if (currentCount >= 600 && currentCount < 650) {
    nextDrip(65)
  } else if (currentCount >= 650 && currentCount < 700) {
    nextDrip(60)
  } else if (currentCount >= 700 && currentCount < 750) {
    nextDrip(55)
  } else if (currentCount >= 750 && currentCount < 800) {
    nextDrip(50)
  } else if (currentCount >= 800 && currentCount < 850) {
    nextDrip(45)
  } else if (currentCount >= 850 && currentCount < 900) {
    nextDrip(40)
  } else if (currentCount >= 900 && currentCount < 950) {
    nextDrip(35)
  } else if (currentCount >= 950 && currentCount < 1000) {
    nextDrip(30)
  } else if (currentCount >= 1000) {
    nextDrip(25)
  }
})

let menuToggle = 0
let menuDivs = menu.children
let menuPanelInterval = ''
let menuPanelIntervalB = ''
let intervalCount = 0
menu.addEventListener('click', () => {
  if (menuToggle === 0) {

    // toggle engaged
    clearInterval(dropletInterval)
    menuDivs[0].style.background = 'var(--acnt-a)'
    menuDivs[0].style.transform = 'rotate(225deg) translateY(-10px)'
    menuDivs[1].style.background = 'var(--acnt-a)'
    menuDivs[1].style.transform = 'rotate(315deg)'
    menuDivs[2].style.background = 'var(--acnt-a)'
    menuDivs[2].style.opacity = '0'
    menuDivs[2].style.transform = 'rotate(-360deg)'

    // display menu panel
    menuPanel.style.display = 'grid'
    setTimeout(() => {
      menuPanel.style.opacity = '100'
    }, 200)
    menuPanelInterval = setInterval(() => {
      if (intervalCount > 100) {
	setTimeout(() => {
	  for (let x = 0; x < menuPanel.children.length; x++) {
	    menuPanel.children[x].style.opacity = '100'
	  }
	  clearInterval(menuPanelInterval)
	}, 400)
      } else {
	menuPanel.style.width = `${intervalCount}%`
	intervalCount += 5
      }
    }, 10)
    menuToggle = 1
  } else if (menuToggle === 1) {

    // toggle disengaged
    if (gameFlag === 1) {
      nextDrip(dripSpeed)
    }
    menuDivs[0].style.background = 'var(--acnt-d)'
    menuDivs[0].style.transform = 'rotate(0deg) translateY(0px)'
    menuDivs[1].style.background = 'var(--acnt-d)'
    menuDivs[1].style.transform = 'rotate(0deg)'
    menuDivs[2].style.background = 'var(--acnt-d)'
    menuDivs[2].style.opacity = '100'
    menuDivs[2].style.transform = 'rotate(0deg)'

    // fade menu panel
    menuPanelIntervalB = setInterval(() => {
      for (let x = 0; x < menuPanel.children.length; x++) {
	menuPanel.children[x].style.opacity = '0'
      }
      setTimeout(() => {
	if (intervalCount < 0) {
	  menuPanel.style.opacity = '0'
	  setTimeout(() => {
	    menuPanel.style.display = 'none'
	  }, 200)
	  clearInterval(menuPanelIntervalB)
	} else {
	  menuPanel.style.width = `${intervalCount}%`
	  intervalCount -= 5
	}
      }, 200)
    }, 10)
    menuToggle = 0
  } 
})

// select theme
themeSelect.addEventListener('change', () => {
  selectedTheme = themeSelect.value
  document.documentElement.setAttribute("data-theme", selectedTheme)
  localStorage.setItem('theme', selectedTheme)
  themeSelect.value = selectedTheme
})

