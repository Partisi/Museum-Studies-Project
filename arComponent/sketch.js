// Main Imports
let myCanvas
let capture

// Setup
function setup() {

    // AR Space
    myCanvas = createCanvas(windowWidth, windowHeight)
    myCanvas.parent('#my-canvas')
    capture = createCapture({
        video: {
            mandatory: {
                maxWidth: myCanvas.width,
                maxHeight: myCanvas.height
            }
        }
    });
    capture.hide();
}

let screenshottedEnv = null // screenshot of AR space of camera
let startClockExperience = false // begins the animation of the clock to VR

// Main AR Function
async function createClockExperience() {

    // Shows animation
    document.getElementById("myAnimation").style.display = 'block'
    await sleep(1000)
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(myCanvas.width / 2, myCanvas.height / 2))
    }
    await sleep(4000) // after set time, mvoes into VR space

    await sleep(1000) // simply wait

    console.log('move on...')
    window.parent.ar_experience_complete();

    ar_experience_complete = true;
}


// Simple Sleeper function to wait for execution
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Particles for Animation
const particles = []
class Particle {
    constructor(x, y) {
        this.xPos = x
        this.yPos = y
        this.xSpeed = random(-1, 1) * random(3, 4)
        this.ySpeed = random(-1, 1) * random(3, 4)

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
        fill(this.color[0], this.color[1], this.color[2], this.opacity)

        ellipse(this.xPos, this.yPos, this.size, this.size)

        if (this.opacity <= 60) {
            this.opacity -= 0.4
        } else {
            this.opacity -= 0.2
        }

        this.xPos += this.xSpeed
        this.yPos += this.ySpeed

        if (this.opacity <= 1) {
            this.alive = false
        }
    }
}

// For taking the screenshot
function mouseClicked() {
    if (loaded === false) {
        screenshottedEnv = capture.get(0, 0, myCanvas.width, myCanvas.height)
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
            console.log("we begin")
            createClockExperience()
        }
    }
    if (!!screenshottedEnv) {
        image(screenshottedEnv, 0, 0, myCanvas.width, myCanvas.height);
    } else {
        image(capture, 0, 0, myCanvas.width, myCanvas.height);
    }

    for (var i = 0; i < particles.length; i++) {
        if (particles[i].alive) {
            particles[i].display()
        } else {
            particles.splice(i)
            i--
        }
    }
}