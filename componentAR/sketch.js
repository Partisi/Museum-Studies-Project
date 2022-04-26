// Main Imports
let myCanvas
let capture
let storyAR

// Setup
function setup() {
    // AR Space


    storyAR = new Story(stepsAR)
    myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('#my-canvas')

    capture = createCapture({
        video: {
            mandatory: {
                maxWidth: myCanvas.width,
                maxHeight: myCanvas.height
            }
        }
    })


    capture.hide()
}

let screenshottedEnv = null // screenshot of AR space of camera
let startClockExperience = false // begins the animation of the clock to VR

// For taking the screenshot
function mousePressed() {
    if (loaded === false) {
        console.log(capture)
        screenshottedEnv = createImage(capture.width, capture.height);
        screenshottedEnv.copy(capture, 0, 0, capture.width, capture.height, 0, 0, screenshottedEnv.width, screenshottedEnv.height);

        startClockExperience = true
    }
}

let loaded = false // used to load once


// Main Drawing
function draw() {
    background(0)
    if (startClockExperience) {
        if (loaded === false) {
            loaded = true
            createClockExperience()
        }
    }
    if (!!screenshottedEnv) {
        //image(screenshottedEnv, 0, 0, 0, windowHeight);
        image(screenshottedEnv, 0, 0, 0, windowHeight);
    } else {
        image(capture, 0, 0, 0, windowHeight);
    }

    for (var i = 0; i < particles.length; i++) {
        if (particles[i].alive) {
            particles[i].display()
        } else {
            particles.splice(i)
            i--
        }
    }
    for (var i = 0; i < orbs.length; i++) {
        if (orbs[i].alive) {
            orbs[i].display()
        } else {
            orbs.splice(i)
            i--
        }
    }
}

function windowResized() {
    console.log("resized")
    resizeCanvas(windowWidth, windowHeight);
  }

function introSpeak(dialoguePiece) {
    console.log(dialoguePiece)
    dialoguePiece.display()
}

// Main AR Function
async function createClockExperience() {

    // Shows animation
    document.getElementById("myAnimation").style.display = 'block'
    document.getElementById('intro-dialogue').style.display = 'block'

    await sleep(1000)
    storyAR.steps[0].actions[0].display()

    await sleep(4000)
    storyAR.steps[0].actions[0].hide()
    storyAR.steps[0].actions[1].display()
    
    await sleep(4000)
    storyAR.steps[0].actions[1].hide()

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(myCanvas.width / 2, myCanvas.height / 2))
    }

    // Left Side
    orbs.push(new MagicalOrb(
        myCanvas.width / 2 - 10,
        myCanvas.height / 2,
        [252, 78, 3],
        50, 5
    ))
    orbs.push(new MagicalOrb(
        myCanvas.width / 2,
        myCanvas.height / 2,
        [255, 229, 79],
        40, 5
    ))
    // Right Side
    orbs.push(new MagicalOrb(
        myCanvas.width / 2 - 10,
        myCanvas.height / 2,
        [252, 78, 3],
        50, -4
    ))
    orbs.push(new MagicalOrb(
        myCanvas.width / 2,
        myCanvas.height / 2,
        [255, 229, 79],
        40, -4
    ))
    await sleep(8000) // after set time, mvoes into VR space

    console.log('move on...')
    window.parent.ar_experience_complete();

    ar_experience_complete = true;
}

// Particles for Animation
const particles = []
class Particle {
    constructor(x, y) {
        this.xPos = x
        this.yPos = y
        this.xSpeed = random(-1, 1) * random(1, 2)
        this.ySpeed = random(-1, 1) * random(1, 2)

        this.size = random(15, 30)

        this.opacity = 100

        this.colorSelections = [
            [3, 252, 223],
            [245, 59, 242],
            [108, 230, 126]
        ]
        this.color = random(this.colorSelections)

        this.alive = true
    }
    display() {
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], this.opacity * 1.2)

        ellipse(this.xPos, this.yPos, this.size, this.size)

        this.xPos += this.xSpeed
        this.yPos += this.ySpeed

        if (this.opacity <= 60) {
            this.opacity -= 0.2
        } else {
            this.opacity -= 0.1
        }

        if (this.opacity <= 1) {
            this.alive = false
        }
    }
}
const tailLength = 80
let trail = []
const orbs = []
class MagicalOrb {
    constructor(x, y, color, size, angle) {
        this.x = x
        this.y = y
        this.scalar = 200
        this.angle = angle
        this.speed = 0.05
        this.col = color
        this.opacity = 100
        this.alive = true

        this.size = size

    }
    display() {

        var x = this.x + cos(this.angle) * this.scalar;
        var y = this.y + sin(this.angle) * this.scalar;
        fill(this.col[0], this.col[1], this.col[2], this.opacity * 1.2);
        noStroke();
        ellipse(x, y, this.size, this.size);
        trail.push({ x, y });
        this.angle += this.speed;
        this.scalar += this.speed;

        if (this.opacity <= 60) {
            this.opacity -= 0.2
        } else {
            this.opacity -= 0.1
        }

        if (this.opacity <= 1) {
            this.alive = false
        }

        if (trail.length > tailLength) {
            trail.shift()
        }
        for (let i = 0; i < trail.length; i += 1) {
            fill(this.col[0] - 30, this.col[1], this.col[2], this.opacity / 2)
            ellipse(trail[i].x, trail[i].y, i, i)
        }
    }
}