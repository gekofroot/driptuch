
// variables
let menu = document.getElementById('menu')
let menuDivA = document.getElementById('menu-div-a')
let menuDivB = document.getElementById('menu-div-b')
let menuDivC = document.getElementById('menu-div-c')
let menuPanel = document.getElementById('menu-panel')
let themeSelect = document.getElementById('theme-select')
let mainFieldWrapper = document.getElementById('main-field-wrapper')
let mainField = document.getElementById('main-field')
let mainFieldBorder = document.getElementById('main-field-border')
let play = document.getElementById('play')
let playIcon = document.getElementById('play-icon')
let playShader = document.getElementById('play-shader')
let fillShader = document.getElementById('fill-shader')
let surfaceShader = document.getElementById('surface-shader')
let displayField = document.getElementById('display-field')
let highScoreDisplay = document.getElementById('high-score-display')
let pointsDisplay = document.getElementById('points-display')
let dropletsDisplay = document.getElementById('droplets-display')
let orbField = document.getElementById('orb-field')
let fieldAreas = document.getElementById('field-areas')
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
let toGlitterCount = 0
let glDropletInterval = ''
let glDropletIntervalB = ''
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
let glitterDripColors = [
  '#fefbe8', '#dbc481', 
  '#e2c684', '#e2c679',
  '#e0c779', '#ffffff',

  '#866427', '#fdecbb', 
  '#d5b475', '#ffeec9',
  '#fffef8', '#efde9b',

  '#fdf6c4', '#f3eb9f', 
  '#fff0b0', '#f5e8be',
  '#fefbdd', '#fae0ad'
]
let glDroplets = 0
let glDripIndex = 0
let glDripIndexB = glitterDripColors.length - 1
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

// area anim
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

// display area anim
function displayAreaAnim(timeoutValue) {
  setTimeout(() => {
    pointsDisplay.style.color = 'var(--clr)'
    pointsDisplay.style.padding = 'unset'
    pointsDisplay.style.height = '0'
    dropletsDisplay.style.color = 'var(--clr)'
    dropletsDisplay.style.padding = 'unset'
    dropletsDisplay.style.height = '0'
    setTimeout(() => {
      pointsDisplay.style.color = 'var(--txt)'
      pointsDisplay.style.padding = '1.5em 0'
      pointsDisplay.style.height = '2em'
      dropletsDisplay.style.color = 'var(--txt)'
      dropletsDisplay.style.padding = '1.5em 0'
      dropletsDisplay.style.height = '2em'
    }, timeoutValue)
  }, 30)
}

// generate droplet position
function generateDropletPos(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function generateDropletSize(min, max) {
  let multiplier = 1000
  let currentNumber = Math.random() * (max - min) + min
  return Math.round(currentNumber * multiplier) / multiplier
}

// build droplets
let dropletInterval = ''
function dropletDrip() {

  // droplet interval function
  dropletInterval = setInterval(() => {
    let dropletElements = document.getElementsByClassName('droplet')
    if (dropletElements.length > 14) {
      if (gameFlag === 0) {
      } else {
	
	// game loop inactive
	gameFlag = 0
	clearInterval(dropletInterval)
	mainFieldBorder.style.animationDuration = '5s'

	// store value
	if (points > highScore) {
	  highScore = points
	  highScoreDisplay.innerHTML = highScore
	  localStorage.setItem('high-score', highScore)
	}

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
	  toGlitterCount = 0
	  glDripIndex = 0
	  glDripIndexB = glitterDripColors.length - 1
	  clearInterval(glDropletInterval)
	  clearInterval(glDropletIntervalB)
	  play.style.display = 'flex'
	}, 6000)
	setTimeout(() => {
	  mainFieldBorder.style.animationPlayState = 'paused'
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

      // assemble droplet attributes
      // create droplet
      let newDroplet = document.createElement('button')
      newDroplet.setAttribute('id', `droplet-${droplets}`)
      newDroplet.setAttribute('class', 'droplet')
      newDroplet.style.left = `${dropletLeft}px`
      newDroplet.style.top = `${dropletTop}px`
      
      // boost drip droplet
      if (boosterCount === 3) {
	mainField.style.background = 'radial-gradient(#050505, #0c0c0c)'
	if (droplets % 3 === 0) {
	  points += 2
	  pointsDisplay.innerHTML = points
	  localStorage.setItem('points', points)

	  // orb regen
	  if (orbCount < 7) {
	    displayAreaAnim(100)
	    orbCount += 1
	    localStorage.setItem('orb-count', orbCount)
	    for (let x = 0; x < orbField.children.length; x++) {
	      orbField.children[x].style.background = 'var(--orb-inactive)'
	    }
	    for (let x = 0; x < orbCount; x++) {
	      orbField.children[x].style.background = 'var(--orb-active)'
	    }
	  }
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
	boostDripValue = 1
	toGlitterCount += 1

	// orb regen
	if (orbCount < 7) {
	  displayAreaAnim(100)
	  orbCount += 1
	  localStorage.setItem('orb-count', orbCount)
	  for (let x = 0; x < orbField.children.length; x++) {
	    orbField.children[x].style.background = 'var(--orb-inactive)'
	  }
	  for (let x = 0; x < orbCount; x++) {
	    orbField.children[x].style.background = 'var(--orb-active)'
	  }
	} else if (orbCount < 6) {
	  displayAreaAnim(100)
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
	if (toGlitterCount === 150) {
	  points += 9
	  pointsDisplay.innerHTML = points
	  localStorage.setItem('points', points)
	  fieldAreaAnim()
	  displayAreaAnim(100)
	  glDropletDrip()
	} else if (toGlitterCount === 300) {
	  points += 15
	  pointsDisplay.innerHTML = points
	  localStorage.setItem('points', points)
	  fieldAreaAnim()
	  displayAreaAnim(100)
	  glDropletDripB()
	}
      } else {
	mainField.style.background = 'radial-gradient(#070707, #0e0e0e)'
	newDroplet.style.background = `radial-gradient(var(--droplet), var(--orb-active))`
	newDroplet.style.boxShadow = `var(--droplet-acnt) 0 0 .1em .1em, inset -.5em -.5em .2em var(--bd)`
      }

      // drip droplet to main field
      mainField.appendChild(newDroplet)
      if (mainField.children.length <= 5) {
	mainFieldBorder.style.animationPlayState = 'paused'
	mainFieldBorder.style.animationDuration = '2s'
      } else if (mainField.children.length > 5 && mainField.children.length <= 8) {
	mainFieldBorder.style.animationPlayState = 'running'
	mainFieldBorder.style.animationDuration = '2s'
      } else if (mainField.children.length > 8 && mainField.children.length <= 11) {
	mainFieldBorder.style.animationDuration = '1s'
      } else if (mainField.children.length > 11 && mainField.children.length <= 15) {
	mainFieldBorder.style.animationDuration = '.7s'
      }
      setTimeout(() => {
	newDroplet.style.opacity = '100'
      }, 2)
      droplets += 1
      dropletsDisplay.innerHTML = droplets
      localStorage.setItem('droplets', droplets)
    }
  }, dripSpeed)
}

// build boost drip glitter droplets (gold/silver)
function glDropletDrip() {
  glDropletInterval = setInterval(() => {

    // position dldroplet x, y values on field
    let glDropletLeft = 0
    let glDropletTop = 0
    if (windowWidth > 1080) {
      glDropletLeft = generateDropletPos(10, mainFieldWidth)
      if (glDropletLeft >= (mainFieldWidth - 60)) {
	while (glDropletLeft >= (mainFieldWidth - glDropletLeft)) {
	  glDropletLeft = generateDropletPos(10, mainFieldWidth)
	}
      }
      glDropletTop = generateDropletPos(10, mainFieldHeight)
      if (glDropletTop >= (mainFieldHeight - 60)) {
	while (glDropletTop >= (mainFieldHeight - glDropletTop)) {
	  glDropletTop = generateDropletPos(10, mainFieldHeight)
	}
      }
    } else {
      glDropletLeft = generateDropletPos(10, mainFieldWidth)
      if (glDropletLeft >= (mainFieldWidth - 50)) {
	while (glDropletLeft >= (mainFieldWidth - glDropletLeft)) {
	  glDropletLeft = generateDropletPos(10, mainFieldWidth)
	}
      }
      glDropletTop = generateDropletPos(10, mainFieldHeight)
      if (glDropletTop >= (mainFieldHeight - 50)) {
	while (glDropletTop >= (mainFieldHeight - glDropletTop)) {
	  glDropletTop = generateDropletPos(10, mainFieldHeight)
	}
      }
    }
    
    // assemble glitter droplet attributes
    // create glitter droplet
    let newGlDroplet = document.createElement('button')
    let glDropletSize = generateDropletSize(.1, .5)
    newGlDroplet.setAttribute('id', `droplet-gl-${glDroplets}`)
    newGlDroplet.setAttribute('class', 'droplet-gl')
    newGlDroplet.style.left = `${glDropletLeft}px`
    newGlDroplet.style.top = `${glDropletTop}px`
    newGlDroplet.style.width = `${glDropletSize}em`
    newGlDroplet.style.height = `${glDropletSize}em`
    newGlDroplet.style.background = `radial-gradient(${glitterDripColors[glDripIndex]}, ${glitterDripColors[glDripIndexB]})`
    newGlDroplet.style.boxShadow = `${glitterDripColors[glDripIndex]} 0 0 .1em .1em, inset -.1em -.1em .2em ${glitterDripColors[glDripIndexB]}`
    let zNumberValue = Math.round(Math.random() * 10)
    if (zNumberValue === 0) {
      newGlDroplet.style.zIndex = `1`
    } else if (zNumberValue === 1) {
      newGlDroplet.style.zIndex = `4`
    }
    if (glDripIndex > glitterDripColors.length - 1) {
      glDripIndex = 0
    } else {
      glDripIndex += 1
    }
    if (glDripIndexB === 0) {
      glDripIndexB = glitterDripColors.length - 1
    } else {
      glDripIndexB -= 1
    }

    // drip droplet to main field
    mainField.appendChild(newGlDroplet)
    setTimeout(() => {
      newGlDroplet.style.opacity = '100'
    }, 10)
    glDroplets += 1
  }, 100)

  let glDropletElements = document.getElementsByClassName('droplet-gl')
  setInterval(() => {
    for (let x = 0; x < glDropletElements.length; x++) {
      if (x % 3 === 0) {
	glDropletElements[x].style.opacity = '0'
      }
    }
    setTimeout(() => {
      for (let x = 0; x < glDropletElements.length; x++) {
	if (x % 3 === 0) {
	  mainField.removeChild(glDropletElements[x])
	}
      }
    }, 1000)
  }, 1000)
}

// build boost drip glitter droplets b (rainbow)
function glDropletDripB() {
  glDropletIntervalB = setInterval(() => {

    // position dldroplet x, y values on field
    let glDropletLeft = 0
    let glDropletTop = 0
    if (windowWidth > 1080) {
      glDropletLeft = generateDropletPos(10, mainFieldWidth)
      if (glDropletLeft >= (mainFieldWidth - 60)) {
	while (glDropletLeft >= (mainFieldWidth - glDropletLeft)) {
	  glDropletLeft = generateDropletPos(10, mainFieldWidth)
	}
      }
      glDropletTop = generateDropletPos(10, mainFieldHeight)
      if (glDropletTop >= (mainFieldHeight - 60)) {
	while (glDropletTop >= (mainFieldHeight - glDropletTop)) {
	  glDropletTop = generateDropletPos(10, mainFieldHeight)
	}
      }
    } else {
      glDropletLeft = generateDropletPos(10, mainFieldWidth)
      if (glDropletLeft >= (mainFieldWidth - 50)) {
	while (glDropletLeft >= (mainFieldWidth - glDropletLeft)) {
	  glDropletLeft = generateDropletPos(10, mainFieldWidth)
	}
      }
      glDropletTop = generateDropletPos(10, mainFieldHeight)
      if (glDropletTop >= (mainFieldHeight - 50)) {
	while (glDropletTop >= (mainFieldHeight - glDropletTop)) {
	  glDropletTop = generateDropletPos(10, mainFieldHeight)
	}
      }
    }
    
    // assemble glitter droplet b attributes
    // create glitter droplet b
    let newGlDroplet = document.createElement('button')
    let glDropletSize = generateDropletSize(.1, .2)
    newGlDroplet.setAttribute('id', `droplet-gl-b-${glDroplets}`)
    newGlDroplet.setAttribute('class', 'droplet-gl-b')
    newGlDroplet.style.left = `${glDropletLeft}px`
    newGlDroplet.style.top = `${glDropletTop}px`
    newGlDroplet.style.width = `${glDropletSize}em`
    newGlDroplet.style.height = `${glDropletSize}em`
    newGlDroplet.style.background = `radial-gradient(${boostDripColors[glDripIndex]}, ${boostDripColors[glDripIndexB]})`
    newGlDroplet.style.boxShadow = `${boostDripColors[glDripIndex]} 0 0 .1em .1em, inset -.1em -.1em .2em ${boostDripColors[glDripIndexB]}`
    let zNumberValue = Math.round(Math.random() * 5)
    if (zNumberValue === 0) {
      newGlDroplet.style.zIndex = `1`
    } else if (zNumberValue === 1) {
      newGlDroplet.style.zIndex = `4`
    }
    if (glDripIndex > glitterDripColors.length - 1) {
      glDripIndex = 0
    } else {
      glDripIndex += 1
    }
    if (glDripIndexB === 0) {
      glDripIndexB = glitterDripColors.length - 1
    } else {
      glDripIndexB -= 1
    }

    // drip droplet to main field
    mainField.appendChild(newGlDroplet)
    setTimeout(() => {
      newGlDroplet.style.opacity = '100'
    }, 10)
    glDroplets += 1
  }, 10)

  let glDropletElementsB = document.getElementsByClassName('droplet-gl-b')
  setInterval(() => {
    for (let x = 0; x < glDropletElementsB.length; x++) {
      if (x % 2 === 0) {
	glDropletElementsB[x].style.opacity = '0'
      }
    }
    setTimeout(() => {
      for (let x = 0; x < glDropletElementsB.length; x++) {
	if (x % 2 === 0) {
	  mainField.removeChild(glDropletElementsB[x])
	}
      }
    }, 700)
  }, 700)
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

    // fill play shader h.
    let playShaderCount = 0
    let playShaderInterval = setInterval(() => {
      if (playShaderCount > 100) {
	clearInterval(playShaderInterval)
      } else {
	playShader.style.width = `${playShaderCount}%`
	playShaderCount += 1
      }
    }, 1)
    
    // fill play shader v.
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
    glDroplets = 0
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
	mainFieldBorder.style.animationDuration = '5s'
	mainFieldBorder.style.animationPlayState = 'running'
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
      if (streamCount > 0 && streamCount % 75 === 0) {
	if (boosterCount < 4) {
	  boosterCount += 1
	  fieldAreaAnim()
	  displayAreaAnim(100)
	}
      }

      // adjust stream
      if (currentCount >= 75) {
	if (streamCount > 0 && streamCount % 45 === 0) {
	  prevDrip(5)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 75 === 0) {
	  prevDrip(25)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 150 === 0) {
	  prevDrip(50)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 300 === 0) {
	  prevDrip(100)
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
	points += 9

	// boost drip main
	if (streamCount > 0 && streamCount % 5 === 0) {
	  points += 5
	  prevDrip(5)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 25 === 0) {
	  points += 9
	  prevDrip(9)
	  localStorage.setItem('current-count', currentCount)
	} else if (streamCount > 0 && streamCount % 75 === 0) {
	  points += 15
	  prevDrip(15)
	  localStorage.setItem('current-count', currentCount)
	}
      }
      pointsDisplay.innerHTML = points
      localStorage.setItem('points', points)
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
	  mainField.style.transform = 'rotate(-360deg) skew(0deg, 2deg)'
	} else if (skewDirection === 1) {
	  mainField.style.transform = 'rotate(-360deg) skew(0deg, -2deg)'
	} else if (skewDirection === 2) {
	  mainField.style.transform = 'rotate(-360deg) skew(2deg, 0deg)'
	} else if (skewDirection === 3) {
	  mainField.style.transform = 'rotate(-360deg) skew(-2deg, 0deg)'
	}
      } else if (boosterCount > 0) {
	if (skewDirection === 0) {
	  mainField.style.transform = 'rotate(-360deg) skew(0deg, 3deg)'
	} else if (skewDirection === 1) {
	  mainField.style.transform = 'rotate(-360deg) skew(0deg, -3deg)'
	} else if (skewDirection === 2) {
	  mainField.style.transform = 'rotate(-360deg) skew(3deg, 0deg)'
	} else if (skewDirection === 3) {
	  mainField.style.transform = 'rotate(-360deg) skew(-3deg, 0deg)'
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
      toGlitterCount = 0
      glDripIndex = 0
      glDripIndexB = glitterDripColors.length - 1
      clearInterval(glDropletInterval)
      clearInterval(glDropletIntervalB)
      if (boostDripValue === 1) {
	displayAreaAnim(50)
	setTimeout(() => {
	  displayAreaAnim(100)
	}, 500)
	boostDripValue = 0
	fieldAreaAnim()
      } else {
	displayAreaAnim(50)
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

// element splash in
pointsDisplay.style.transition = '.9s'
dropletsDisplay.style.transition = '.9s'
let elements = [
  mainFieldWrapper, fieldAreas, 
  displayField, menu, 
  pointsDisplay, dropletsDisplay, 
  orbFieldArea, boosterFieldArea, 
  orbField, boosterField, 
  menuDivA, menuDivB, 
  menuDivC, play
]

let splashCount = 0
let splashInterval = setInterval(()=> {
  if (splashCount > elements.length - 1) {
    pointsDisplay.style.transition = '.2s'
    dropletsDisplay.style.transition = '.2s'
    mainFieldWrapper.style.transition = 'unset'
    mainFieldWrapper.style.transitionTimingFunction = 'unset'
    clearInterval(splashInterval)
    setTimeout(()=> {
      fieldAreaAnim()
    }, 500)
  } else {
    elements[splashCount].style.display = 'flex'
    setTimeout(()=> {
      elements[splashCount].style.opacity = '100'
      splashCount += 1
    }, 250)
  }
}, 300)

