
// variables
let menu = document.getElementById('menu')
let menuPanel = document.getElementById('menu-panel')
let themeSelect = document.getElementById('theme-select')
let mainField = document.getElementById('main-field')
let mainFieldBorder = document.getElementById('main-field-border')
let play = document.getElementById('play')
let playIcon = document.getElementById('play-icon')
let playShader = document.getElementById('play-shader')
let fillShader = document.getElementById('fill-shader')
let surfaceShader = document.getElementById('surface-shader')
let highScoreDisplay = document.getElementById('high-score-display')
let pointsDisplay = document.getElementById('points-display')
let dropletsDisplay = document.getElementById('droplets-display')
let orbField = document.getElementById('orb-field')
let orbFieldArea = document.getElementById('orb-field-area')
let boosterField = document.getElementById('booster-field')
let boosterFieldArea = document.getElementById('booster-field-area')

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
let boostCount = 0
let boostDripValue = 0
let boostDripColors = [
  '#ff1111', '#ffaa11', 
  '#ffff11', '#11ff11',
  '#1111ff', '#ff11ff',

  '#ff3333', '#ffaa33', 
  '#ffff33', '#33ff33',
  '#3333ff', '#ff33ff',

  '#ff5555', '#ff5555', 
  '#ffff55', '#55ff55',
  '#5555ff', '#ff55ff'
]
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

// field area anim
function fieldAreaAnim() {
  orbField.style.display = 'none'
  orbFieldArea.style.padding = 'unset'
  orbFieldArea.style.height = '0'
  boosterField.style.display = 'none'
  boosterFieldArea.style.padding = 'unset'
  boosterFieldArea.style.height = '0'
  mainFieldBorder.style.marginTop = '3em'
  mainFieldBorder.style.transition = '.4s'
  setTimeout(() => {
    orbField.style.display = 'flex'
    orbFieldArea.style.padding = '2em'
    orbFieldArea.style.height = '3em'
    boosterField.style.display = 'flex'
    boosterFieldArea.style.padding = '2em'
    boosterFieldArea.style.height = '3em'
    mainFieldBorder.style.marginTop = 'unset'
    mainFieldBorder.style.transition = '2s'
  }, 200)
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
      if (gameFlag === 0) {
      } else {
	
	// game loop inactive
	gameFlag = 0
	clearInterval(dropletInterval)

	// append surface shader node
	let surfaceShaderNode = document.createElement('div')
	surfaceShaderNode.setAttribute('id', 'surface-shader')
	surfaceShaderNode.setAttribute('class', 'surface-shader')
	surfaceShaderNode.style.transition = '3s'
	surfaceShaderNode.style.opacity = '0'
	surfaceShaderNode.style.height = '100%'
	surfaceShaderNode.style.width = '100%'
	mainField.appendChild(surfaceShaderNode)
	surfaceShader = document.getElementById('surface-shader')
        setTimeout(() => {
	  surfaceShaderNode.style.opacity = '100'
	}, 2000)

	// main field border anim
	mainFieldBorder.style.transition = '6s'
	mainFieldBorder.style.transform = 'rotate(0deg)'
	mainFieldBorder.style.background = 'var(--main)'
	mainField.style.transition = '6s'
	mainField.style.transform = 'rotate(0deg)'
	mainField.style.border = '.2em outset var(--bd)'

	// append shader node
	let shaderNode = document.createElement('div')
	shaderNode.setAttribute('id', 'main-field-shader')
	shaderNode.setAttribute('class', 'main-field-shader')
	shaderNode.style.opacity = '0'
	mainField.appendChild(shaderNode)
	let mainFieldShaderNode = document.getElementById('main-field-shader')
	setTimeout(() => {
	  mainFieldShaderNode.style.opacity = '100'
	  mainFieldShaderNode.style.transition = '6s'
	  mainFieldShaderNode.style.transform = 'rotate(0deg)'
	}, 100)

	// display play
	setTimeout(() => {
	  play.style.display = 'flex'
	}, 6000)
	setTimeout(() => {
	  play.style.opacity = '100'
	}, 6400)
      }
    } else {

      // game loop active
      // position droplet x, y values on field
      let dropletLeft = 0
      let dropletTop = 0
      if (windowWidth > 1080) {
	dropletLeft = generateDropletPos(110, mainFieldWidth)
	if (dropletLeft >= (mainFieldWidth - 160)) {
	  while (dropletLeft >= (mainFieldWidth - dropletLeft)) {
	    dropletLeft = generateDropletPos(110, mainFieldWidth)
	  }
	}
	dropletTop = generateDropletPos(110, mainFieldHeight)
	if (dropletTop >= (mainFieldHeight - 160)) {
	  while (dropletTop >= (mainFieldHeight - dropletTop)) {
	    dropletTop = generateDropletPos(110, mainFieldHeight)
	  }
	}
      } else {
	dropletLeft = generateDropletPos(70, mainFieldWidth)
	if (dropletLeft >= (mainFieldWidth - 110)) {
	  while (dropletLeft >= (mainFieldWidth - dropletLeft)) {
	    dropletLeft = generateDropletPos(70, mainFieldWidth)
	  }
	}
	dropletTop = generateDropletPos(70, mainFieldHeight)
	if (dropletTop >= (mainFieldHeight - 110)) {
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
      
      // boost drip droplet
      if (boosterCount === 3) {
	if (droplets % 3 === 0) {
	  points += 2
	  pointsDisplay.innerHTML = points
	  localStorage.setItem('points', points)
	  if (points > highScore) {
	    highScore = points
	    highScoreDisplay.innerHTML = highScore
	    localStorage.setItem('high-score', highScore)
	  }
	  mainField.style.background = 'radial-gradient(#050505, #0c0c0c)'
	  newDroplet.style.background = `radial-gradient(${boostDripColors[boostCount]}, var(--orb-active))`
	  newDroplet.style.boxShadow = `${boostDripColors[boostCount]} 0 0 .1em .1em, inset -.5em -.5em .2em ${boostDripColors[boostCount]}`
	  if (boostCount > boostDripColors.length - 2) {
	    boostCount = 0
	  } else {
	    boostCount += 1
	  }
	} else {
	  mainField.style.background = 'radial-gradient(#070707, #0e0e0e)'
	  newDroplet.style.background = `radial-gradient(var(--droplet), var(--orb-active))`
	  newDroplet.style.boxShadow = `var(--droplet-acnt) 0 0 .1em .1em, inset -.5em -.5em .2em var(--bd)`
	}
      } else if (boosterCount === 4) {
	points += 3
	pointsDisplay.innerHTML = points
	localStorage.setItem('points', points)
	if (points > highScore) {
	  highScore = points
	  highScoreDisplay.innerHTML = highScore
	  localStorage.setItem('high-score', highScore)
	}
	boostDripValue = 1
	if (orbCount < 7) {
	  orbCount += 1
	  localStorage.setItem('orb-count', orbCount)
	  for (let x = 0; x < orbField.children.length; x++) {
	    orbField.children[x].style.background = 'var(--orb-inactive)'
	  }
	  for (let x = 0; x < orbCount; x++) {
	    orbField.children[x].style.background = 'var(--orb-active)'
	  }
	} else if (orbCount < 6) {
	  orbCount += 2
	  localStorage.setItem('orb-count', orbCount)
	  for (let x = 0; x < orbField.children.length; x++) {
	    orbField.children[x].style.background = 'var(--orb-inactive)'
	  }
	  for (let x = 0; x < orbCount; x++) {
	    orbField.children[x].style.background = 'var(--orb-active)'
	  }
	}
	mainField.style.background = 'radial-gradient(#050505, #0c0c0c)'
	newDroplet.style.background = `radial-gradient(${boostDripColors[boostCount]}, var(--orb-active))`
	newDroplet.style.boxShadow = `${boostDripColors[boostCount]} 0 0 .1em .1em, inset -.5em -.5em .2em ${boostDripColors[boostCount]}`
	if (boostCount > boostDripColors.length - 2) {
	  boostCount = 0
	} else {
	  boostCount += 1
	}
      } else {
	mainField.style.background = 'radial-gradient(#070707, #0e0e0e)'
	newDroplet.style.background = `radial-gradient(var(--droplet), var(--orb-active))`
	newDroplet.style.boxShadow = `var(--droplet-acnt) 0 0 .1em .1em, inset -.5em -.5em .2em var(--bd)`
      }

      // drip droplet to main field
      mainField.appendChild(newDroplet)
      setTimeout(() => {
	newDroplet.style.opacity = '100'
      }, 2)
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
  event.stopPropagation()
  if (gameFlag === 1) {
  } else {
    gameFlag = 1
    mainFieldBorder.style.transition = '2s'
    mainFieldBorder.style.transform = 'rotate(360deg)'
    mainField.style.transition = '2s'
    mainField.style.transform = 'rotate(-360deg)'
    let mainFieldShader = document.getElementById('main-field-shader')
    play.style.transform = 'translateY(10px)'
    for (let x = 0; x < mainField.children.length; x++) {
      if (mainField.children[x].className === 'main-field-shader') {
	mainField.children[x].style.transition = '2s'
	mainField.children[x].style.transform = 'rotate(-360deg)'
      } else if (mainField.children[x].className === 'droplet') {
	mainField.children[x].style.transform = 'rotate(-180deg)'
	if (x % 2 === 0) {
	  mainField.children[x].style.transform = 'translateY(-5em)'
	} else if (x % 2 === 1) {
	  mainField.children[x].style.transform = 'translateY(5em)'
	}
      }
      mainField.children[x].style.opacity = 0
    }

    surfaceShader.style.transition = '.2s'
    surfaceShader.style.opacity = '0'
    let surfaceShaderCount = 100
    let surfaceShaderInterval = setInterval(() => {
      if (surfaceShaderCount < 0) {
	clearInterval(surfaceShaderInterval)
      } else {
	surfaceShader.style.height = `${surfaceShaderCount}%`
	surfaceShader.style.width = `${surfaceShaderCount}%`
	surfaceShaderCount -= 1
      }
    }, 1)

    let playShaderCount = 0
    let playShaderInterval = setInterval(() => {
      if (playShaderCount > 100) {
	clearInterval(playShaderInterval)
      } else {
	playShader.style.width = `${playShaderCount}%`
	playShaderCount += 1
      }
    }, 1)

    setTimeout(() => {
      let fillShaderCount = 0
      let fillShaderInterval = setInterval(() => {
	if (fillShaderCount > 100) {
	  setTimeout(() => {
	    play.style.opacity = '0'
	    clearInterval(fillShaderInterval)
	  }, 100)
	} else {
	  fillShader.style.height = `${fillShaderCount}%`
	  fillShaderCount += 1
	}
      }, 1)
    }, 500)
    
    // initialize values
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
  
    // initialize field areas
    for (let x = 0; x < orbField.children.length; x++) {
      orbField.children[x].style.background = 'var(--orb-inactive)'
    }
    for (let x = 0; x < boosterField.children.length; x++) {
      boosterField.children[x].style.background = 'var(--booster-inactive)'
    }

    setTimeout(() => {

      // game loop active
      mainField.style.border = '.2em outset var(--orb-active)'
      mainFieldBorder.style.background = 'var(--orb-active)'
      
      // load field areas
      for (let x = 0; x < orbCount; x++) {
	orbField.children[x].style.background = 'var(--orb-active)'
      }
      for (let x = 0; x < boosterCount; x++) {
	boosterField.children[x].style.background = 'var(--booster-active)'
      }
      play.style.display = 'none'
      play.style.transform = 'translateY(0px)'
      playShader.style.width = '0'
      fillShader.style.height = '0'
      playIcon.style.transform = 'rotate(0deg)'
      while (mainField.childNodes.length > 0) {
	mainField.removeChild(mainField.firstChild)
      }

      // commence rain
      setTimeout(() => {
	dropletDrip()
      }, 1000)
    }, 3000)
  }
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
      if (streamCount > 0 && streamCount % 45 === 0) {
	if (boosterCount < 4) {
	  boosterCount += 1
	  fieldAreaAnim()
	}
      }

      // adjust stream
      if (currentCount >= 45) {
	if (streamCount > 0 && streamCount % 20 === 0) {
	  prevDrip(5)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 45 === 0) {
	  prevDrip(15)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 90 === 0) {
	  prevDrip(30)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 270 === 0) {
	  prevDrip(60)
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
	points += 3
      } else if (boosterCount === 2) {
	points += 5
      } else if (boosterCount === 3) {

	// boost drip main
	points += 9
	if (streamCount > 0 && streamCount % 5 === 0) {
	  points += 3
	  prevDrip(1)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 15 === 0) {
	  points += 5
	  prevDrip(3)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 45 === 0) {
	  points += 9
	  prevDrip(5)
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
      eventTarget.style.transform = 'translateY(3.9em)'
      eventTarget.style.transition = '.1s'
      eventTarget.style.opacity = '0'
      setTimeout(() => {
	mainField.removeChild(eventTarget)
      }, 100)
    } else {

      // droplet not touched
      // main field skew
      let skewDirection = Math.floor(Math.random() * 4)
      mainFieldBorder.style.overflow = 'visible'
      mainField.style.transition = '.2s'
      if (boosterCount === 0) {
	if (skewDirection === 0) {
	  mainField.style.transform = 'rotate(-360deg) skew(0deg, 1deg)'
	} else if (skewDirection === 1) {
	  mainField.style.transform = 'rotate(-360deg) skew(0deg, -1deg)'
	} else if (skewDirection === 2) {
	  mainField.style.transform = 'rotate(-360deg) skew(1deg, 0deg)'
	} else if (skewDirection === 3) {
	  mainField.style.transform = 'rotate(-360deg) skew(-1deg, 0deg)'
	}
      } else if (boosterCount > 0) {
	if (skewDirection === 0) {
	  mainField.style.transform = 'rotate(-360deg) skew(0deg, 2deg)'
	} else if (skewDirection === 1) {
	  mainField.style.transform = 'rotate(-360deg) skew(0deg, -2deg)'
	} else if (skewDirection === 2) {
	  mainField.style.transform = 'rotate(-360deg) skew(2deg, 0deg)'
	} else if (skewDirection === 3) {
	  mainField.style.transform = 'rotate(-360deg) skew(-2deg, 0deg)'
	}
      }
      if (boosterCount === 4) {
	setTimeout(() => {
	  mainField.style.transform = 'rotate(-360deg) skew(0deg, 0deg)'
	  mainField.style.transition = '1s'
	}, 200)
      } else {
	setTimeout(() => {
	  mainField.style.transform = 'rotate(-360deg) skew(0deg, 0deg)'
	  mainField.style.transition = '.7s'
	}, 200)
      }
      streamCount = 0
      boosterCount = 0
      if (boostDripValue === 1) {
	boostDripValue = 0
	fieldAreaAnim()
      } else {
	orbCount -= 1
	localStorage.setItem('orb-count', orbCount)
	for (let x = 0; x < orbField.children.length; x++) {
	  orbField.children[x].style.background = 'var(--orb-inactive)'
	}
	for (let x = 0; x < orbCount; x++) {
	  orbField.children[x].style.background = 'var(--orb-active)'
	}
      }
      for (let x = 0; x < boosterField.children.length; x++) {
	boosterField.children[x].style.background = 'var(--booster-inactive)'
      }
      for (let x = 0; x < boosterCount; x++) {
	boosterField.children[x].style.background = 'var(--booster-active)'
      }
      if (points > 0) {
	if (orbCount < 1) {
	  points -= 2
	}
      }
      pointsDisplay.innerHTML = points
      localStorage.setItem('points', points)
    }

    // drip current
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
      nextDrip(148)
    } else if (currentCount >= 365 && currentCount < 410) {
      nextDrip(146)
    } else if (currentCount >= 410 && currentCount < 455) {
      nextDrip(144)
    } else if (currentCount >= 455 && currentCount < 500) {
      nextDrip(142)
    } else if (currentCount >= 500 && currentCount < 550) {
      nextDrip(140)
    } else if (currentCount >= 550 && currentCount < 600) {
      nextDrip(138)
    } else if (currentCount >= 600 && currentCount < 650) {
      nextDrip(136)
    } else if (currentCount >= 650 && currentCount < 700) {
      nextDrip(134)
    } else if (currentCount >= 700 && currentCount < 750) {
      nextDrip(132)
    } else if (currentCount >= 750 && currentCount < 800) {
      nextDrip(130)
    } else if (currentCount >= 800 && currentCount < 850) {
      nextDrip(128)
    } else if (currentCount >= 850 && currentCount < 900) {
      nextDrip(126)
    } else if (currentCount >= 900 && currentCount < 950) {
      nextDrip(124)
    } else if (currentCount >= 950 && currentCount < 1000) {
      nextDrip(122)
    } else if (currentCount >= 1000 && currentCount < 1050) {
      nextDrip(120)
    } else if (currentCount >= 1050 && currentCount < 1100) {
      nextDrip(118)
    } else if (currentCount >= 1100 && currentCount < 1150) {
      nextDrip(116)
    } else if (currentCount >= 1150 && currentCount < 1200) {
      nextDrip(114)
    } else if (currentCount >= 1200 && currentCount < 1250) {
      nextDrip(112)
    } else if (currentCount >= 1250 && currentCount < 1300) {
      nextDrip(110)
    } else if (currentCount >= 1300 && currentCount < 1350) {
      nextDrip(108)
    } else if (currentCount >= 1350 && currentCount < 1400) {
      nextDrip(106)
    } else if (currentCount >= 1400 && currentCount < 1450) {
      nextDrip(104)
    } else if (currentCount >= 1450 && currentCount < 1500) {
      nextDrip(102)
    } else if (currentCount >= 1500 && currentCount < 1550) {
      nextDrip(100)
    } else if (currentCount >= 1550 && currentCount < 1600) {
      nextDrip(98)
    } else if (currentCount >= 1600 && currentCount < 1650) {
      nextDrip(96)
    } else if (currentCount >= 1650 && currentCount < 1700) {
      nextDrip(94)
    } else if (currentCount >= 1700 && currentCount < 1750) {
      nextDrip(92)
    } else if (currentCount >= 1750 && currentCount < 1800) {
      nextDrip(90)
    } else if (currentCount >= 1800 && currentCount < 1850) {
      nextDrip(88)
    } else if (currentCount >= 1850 && currentCount < 1900) {
      nextDrip(86)
    } else if (currentCount >= 1900 && currentCount < 1950) {
      nextDrip(84)
    } else if (currentCount >= 1950 && currentCount < 2000) {
      nextDrip(82)
    } else if (currentCount >= 2000 && currentCount < 2050) {
      nextDrip(80)
    } else if (currentCount >= 2050 && currentCount < 2100) {
      nextDrip(78)
    } else if (currentCount >= 2100 && currentCount < 2150) {
      nextDrip(76)
    } else if (currentCount >= 2150 && currentCount < 2200) {
      nextDrip(74)
    } else if (currentCount >= 2200 && currentCount < 2250) {
      nextDrip(72)
    } else if (currentCount >= 2250 && currentCount < 2300) {
      nextDrip(70)
    } else if (currentCount >= 2300 && currentCount < 2350) {
      nextDrip(68)
    } else if (currentCount >= 2350 && currentCount < 2400) {
      nextDrip(66)
    } else if (currentCount >= 2400 && currentCount < 2450) {
      nextDrip(64)
    } else if (currentCount >= 2450 && currentCount < 2500) {
      nextDrip(62)
    } else if (currentCount >= 2500 && currentCount < 2550) {
      nextDrip(60)
    } else if (currentCount >= 2550 && currentCount < 2600) {
      nextDrip(58)
    } else if (currentCount >= 2600 && currentCount < 2650) {
      nextDrip(56)
    } else if (currentCount >= 2650 && currentCount < 2700) {
      nextDrip(54)
    } else if (currentCount >= 2700 && currentCount < 2750) {
      nextDrip(52)
    } else if (currentCount >= 2750 && currentCount < 2800) {
      nextDrip(50)
    } else if (currentCount >= 2800 && currentCount < 2850) {
      nextDrip(48)
    } else if (currentCount >= 2850 && currentCount < 2900) {
      nextDrip(46)
    } else if (currentCount >= 2900 && currentCount < 2950) {
      nextDrip(44)
    } else if (currentCount >= 2950 && currentCount < 3000) {
      nextDrip(42)
    } else if (currentCount >= 3000 && currentCount < 3050) {
      nextDrip(40)
    } else if (currentCount >= 3050 && currentCount < 3100) {
      nextDrip(38)
    } else if (currentCount >= 3100 && currentCount < 3150) {
      nextDrip(36)
    } else if (currentCount >= 3150 && currentCount < 3200) {
      nextDrip(34)
    } else if (currentCount >= 3200 && currentCount < 3250) {
      nextDrip(32)
    } else if (currentCount >= 3250 && currentCount < 3300) {
      nextDrip(30)
    } else if (currentCount >= 3300 && currentCount < 3350) {
      nextDrip(28)
    } else if (currentCount >= 3350 && currentCount < 3400) {
      nextDrip(26)
    } else if (currentCount >= 3400 && currentCount < 3450) {
      nextDrip(24)
    } else if (currentCount >= 3450 && currentCount < 3500) {
      nextDrip(22)
    } else if (currentCount >= 3500 && currentCount < 3550) {
      nextDrip(20)
    } else if (currentCount >= 3550 && currentCount < 3600) {
      nextDrip(19)
    } else if (currentCount >= 3600 && currentCount < 3650) {
      nextDrip(18)
    } else if (currentCount >= 3650 && currentCount < 3700) {
      nextDrip(17)
    } else if (currentCount >= 3700 && currentCount < 3750) {
      nextDrip(16)
    } else if (currentCount >= 3750) {
      nextDrip(15)
    }
    currentCount += 1
    localStorage.setItem('current-count', currentCount)
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
    menuDivs[1].style.background = 'var(--play)'
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
    }, 2)
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
    }, 2)
    menuToggle = 0
  } 
})

// select theme
themeSelect.addEventListener('change', () => {
  mainFieldBorder.style.transition = '.1s'
  mainField.style.transition = '.1s'
  selectedTheme = themeSelect.value
  document.documentElement.setAttribute("data-theme", selectedTheme)
  localStorage.setItem('theme', selectedTheme)
  themeSelect.value = selectedTheme
})

