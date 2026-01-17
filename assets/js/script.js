
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
let windowWidth = window.outerWidth

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
      clearInterval(dropletInterval)

      // append shader node
      let shaderNode = document.createElement('div')
      shaderNode.setAttribute('id', 'main-field-shader')
      shaderNode.setAttribute('class', 'main-field-shader')
      mainField.appendChild(shaderNode)
      let mainFieldShaderNode = document.getElementById('main-field-shader')
      mainFieldShaderNode.style.opacity = '0'
      setTimeout(() => {
	mainFieldShaderNode.style.opacity = '100'
      }, 10)

      // display play
      setTimeout(() => {
	play.style.display = 'flex'
      }, 1000)
      setTimeout(() => {
	play.style.opacity = '100'
      }, 1400)
    } else {

      // game loop active
      // position droplet x, y values on field
      let dropletLeft = 0
      let dropletTop = 0
      if (windowWidth > 1080) {
	dropletLeft = generateDropletPos(130, mainFieldWidth)
	if (dropletLeft >= (mainFieldWidth - 160)) {
	  while (dropletLeft >= (mainFieldWidth - dropletLeft)) {
	    dropletLeft = generateDropletPos(130, mainFieldWidth)
	  }
	}
	dropletTop = generateDropletPos(130, mainFieldHeight)
	if (dropletTop >= (mainFieldHeight - 160)) {
	  while (dropletTop >= (mainFieldHeight - dropletTop)) {
	    dropletTop = generateDropletPos(130, mainFieldHeight)
	  }
	}
      } else {
	dropletLeft = generateDropletPos(70, mainFieldWidth)
	if (dropletLeft >= (mainFieldWidth - 100)) {
	  while (dropletLeft >= (mainFieldWidth - dropletLeft)) {
	    dropletLeft = generateDropletPos(70, mainFieldWidth)
	  }
	}
	dropletTop = generateDropletPos(70, mainFieldHeight)
	if (dropletTop >= (mainFieldHeight - 100)) {
	  while (dropletTop >= (mainFieldHeight - dropletTop)) {
	    dropletTop = generateDropletPos(70, mainFieldHeight)
	  }
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
  currentCount -= currentCountDrop
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
  let mainFieldShader = document.getElementById('main-field-shader')
  event.stopPropagation()
  play.style.transform = 'translateY(10px)'
  //mainFieldShader.style.opacity = '0'
  for (let x = 0; x < mainField.children.length; x++) {
    if (mainField.children[x].className === 'main-field-shader') {
      mainField.children[x].style.transform = 'rotate(180deg)'
    } else if (mainField.children[x].className === 'droplet') {
      mainField.children[x].style.transform = 'rotate(-180deg)'
      mainField.children[x].style.transform = 'translateY(5em)'
    }
    mainField.children[x].style.opacity = 0
  }
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
    while (mainField.childNodes.length > 0) {
      mainField.removeChild(mainField.firstChild)
    }

    // commence rain
    dropletDrip()
  }, 2000)
})

// main field engaged
mainField.addEventListener('click', () => {
  event.stopPropagation()
  let eventTarget = event.target
  if (gameFlag === 1) {
    
    // game active
    if (eventTarget.className === 'droplet') {

      // droplet touched
      streamCount += 1
      if (streamCount > 0 && streamCount % 30 === 0) {
	if (boosterCount < 4) {
	  boosterCount += 1
	}
      }

      // adjust stream
      if (currentCount >= 30) {
	if (streamCount > 0 && streamCount % 15 === 0) {
	  prevDrip(2)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 30 === 0) {
	  prevDrip(5)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 60 === 0) {
	  prevDrip(30)
	  localStorage.setItem('current-count', currentCount)
	}
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
      } else if (boosterCount === 3) {
	points += 5
	if (streamCount > 0 && streamCount % 5 === 0) {
	  points += 1
	  prevDrip(2)
	  localStorage.setItem('current-count', currentCount)
	}
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
    nextDrip(195)
  } else if (currentCount >= 80 && currentCount < 95) {
    nextDrip(190)
  } else if (currentCount >= 95 && currentCount < 110) {
    nextDrip(185)
  } else if (currentCount >= 110 && currentCount < 125) {
    nextDrip(180)
  } else if (currentCount >= 125 && currentCount < 155) {
    nextDrip(175)
  } else if (currentCount >= 155 && currentCount < 185) {
    nextDrip(170)
  } else if (currentCount >= 185 && currentCount < 215) {
    nextDrip(165)
  } else if (currentCount >= 215 && currentCount < 245) {
    nextDrip(160)
  } else if (currentCount >= 245 && currentCount < 275) {
    nextDrip(155)
  } else if (currentCount >= 275 && currentCount < 320) {
    nextDrip(150)
  } else if (currentCount >= 320 && currentCount < 365) {
    nextDrip(145)
  } else if (currentCount >= 365 && currentCount < 410) {
    nextDrip(140)
  } else if (currentCount >= 410 && currentCount < 455) {
    nextDrip(135)
  } else if (currentCount >= 455 && currentCount < 500) {
    nextDrip(130)
  } else if (currentCount >= 500 && currentCount < 550) {
    nextDrip(125)
  } else if (currentCount >= 550 && currentCount < 600) {
    nextDrip(120)
  } else if (currentCount >= 600 && currentCount < 650) {
    nextDrip(115)
  } else if (currentCount >= 650 && currentCount < 700) {
    nextDrip(110)
  } else if (currentCount >= 700 && currentCount < 750) {
    nextDrip(105)
  } else if (currentCount >= 750 && currentCount < 800) {
    nextDrip(100)
  } else if (currentCount >= 800 && currentCount < 850) {
    nextDrip(95)
  } else if (currentCount >= 850 && currentCount < 900) {
    nextDrip(90)
  } else if (currentCount >= 900 && currentCount < 950) {
    nextDrip(85)
  } else if (currentCount >= 950 && currentCount < 1000) {
    nextDrip(80)
  } else if (currentCount >= 1000 && currentCount < 1050) {
    nextDrip(75)
  } else if (currentCount >= 1050 && currentCount < 1100) {
    nextDrip(70)
  } else if (currentCount >= 1100 && currentCount < 1150) {
    nextDrip(65)
  } else if (currentCount >= 1150 && currentCount < 1200) {
    nextDrip(60)
  } else if (currentCount >= 1200 && currentCount < 1250) {
    nextDrip(55)
  } else if (currentCount >= 1250 && currentCount < 1300) {
    nextDrip(50)
  } else if (currentCount >= 1300 && currentCount < 1350) {
    nextDrip(45)
  } else if (currentCount >= 1350 && currentCount < 1400) {
    nextDrip(40)
  } else if (currentCount >= 1400 && currentCount < 1450) {
    nextDrip(35)
  } else if (currentCount >= 1450 && currentCount < 1500) {
    nextDrip(30)
  } else if (currentCount >= 1500 && currentCount < 1550) {
    nextDrip(25)
  } else if (currentCount >= 1550 && currentCount < 1600) {
    nextDrip(20)
  } else if (currentCount >= 1600 && currentCount < 1650) {
    nextDrip(15)
  } else if (currentCount >= 1650 && currentCount < 1700) {
    nextDrip(10)
  } else if (currentCount >= 1700) {
    nextDrip(5)
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

