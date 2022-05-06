// Main Imports
let myCanvas
let capture
let storyAR

const sounds = {
    muted: false,
    dialogue: []
}

// Setup
function setup() {
    // AR Space

    sounds.magic = loadSound('../audio/misc/harp.wav')
    sounds.teleport = loadSound('../audio/misc/teleport.wav')

    sounds.dialogue[0] = loadSound('../audio/dialogue_prompts_voice/1Hello!MyName.m4a')
    sounds.dialogue[1] = loadSound('../audio/dialogue_prompts_voice/2Ihavelived.m4a')
    sounds.dialogue[2] = loadSound('../audio/dialogue_prompts_voice/3imbored.m4a')

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

let loaded = false // used to load once

// Main Drawing
function draw() {
    background(0)

    // For initial dialogue
    if (loaded === false && storyAR.currentStep === 0 && capture.loadedmetadata) {
        loaded = true
        if (storyAR.currentStep === 0) { sounds.muted = parse(localStorage.getItem('muted')) }
        if (storyAR.steps[storyAR.currentStep].actions.length > 0) {
            if (!sounds.muted) sounds.dialogue[storyAR.steps[storyAR.currentStep].actions[storyAR.currentSubStep].audioIndex].play()
            storyAR.steps[storyAR.currentStep].actions[storyAR.currentSubStep].display()
        }
    }

    // If reached end of AR dialogue, create a screenshot
    if (!startClockExperience && storyAR.currentStep === 1) {
        screenshottedEnv = createImage(capture.width, capture.height);
        screenshottedEnv.copy(capture, 0, 0, capture.width, capture.height, 0, 0, screenshottedEnv.width, screenshottedEnv.height);
        startClockExperience = true
    }

    // begin animation
    if (startClockExperience) {
        if (loaded === false) {
            loaded = true
            createClockExperience()
        }
    }


    // Display video / screenshot
    if (!!screenshottedEnv) {
        //image(screenshottedEnv, 0, 0, 0, windowHeight);
        image(screenshottedEnv, 0, 0, width, height);
    } else {
        image(capture, 0, 0, width, height);
    }

    // Animation particles
    for (var i = 0; i < particles.length; i++) {
        if (particles[i].alive) {
            particles[i].display()
        } else {
            particles.splice(i)
            i--
        }
    }

    // Animation of fireball orbs (they looked cool)
    for (var i = 0; i < orbs.length; i++) {
        if (orbs[i].alive) {
            orbs[i].display()
        } else {
            orbs.splice(i)
            i--
        }
    }
}

// Resize canvas depending on window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// On Dialogue Next
function continueDialogue() {

    if (storyAR.steps[storyAR.currentStep].actions.length > storyAR.currentSubStep + 1) {
        let currentAction = storyAR.steps[storyAR.currentStep].actions[storyAR.currentSubStep]
        currentAction.hide()
        storyAR.currentSubStep += 1
    } else { // moves onto next step (NOT substep)
        if ((storyAR.steps[storyAR.currentStep].actions.length === storyAR.currentSubStep + 1)) {
            let currentAction = storyAR.steps[storyAR.currentStep].actions[storyAR.currentSubStep]
            currentAction.hide()
        }
        storyAR.currentStep += 1
        storyAR.currentSubStep = 0
    }
    loaded = false
}


// Main AR Function
async function createClockExperience() {

    // Shows animation
    document.getElementById("myAnimation").style.display = 'block'
    !sounds.muted && sounds.magic.play()
    await sleep(500)

    for (let i = 0; i < 300; i++) {
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
        50, -4.5
    ))
    orbs.push(new MagicalOrb(
        myCanvas.width / 2,
        myCanvas.height / 2,
        [255, 229, 79],
        40, -4.5
    ))

    await sleep(5000) // after set time, mvoes into VR space

    !sounds.muted && sounds.teleport.play()
    await sleep(3000)

    console.log('move on...')
    window.parent.ar_experience_complete();

    ar_experience_complete = true;
}

// Particles for Animation
const particles = []
class Particle {
    constructor(x, y) {
        this.xPos = random(x - 50, x + 50)
        this.yPos = random(y - 10, y + 20)
        this.xSpeed = random(-1, 1) * random(1, 1.1)
        this.ySpeed = random(-1, 1) * random(0.3, 0.6)

        this.size = random(10, 20)

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
const tailLength = 100 // trail of fireball
let trail = []
const orbs = []
class MagicalOrb {
    constructor(x, y, color, size, angle) {
        this.x = x
        this.y = y + 30
        this.scalar = 150
        this.angle = angle
        this.speed = 0.04
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
        this.scalar += this.speed * 4;

        // Decrease opacity and tail goes on
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