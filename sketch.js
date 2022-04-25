/**
 * Current Issues
 * - AR Individually is FINE
 * - VR Individually is FINE
 * - Moving from AR -> VR still issue
 * 
 * - Current flow is as follows:
 * 1. VR World Created
 * 2. VR World Hidden
 * 3. AR World Created
 * 4. AR World displayed
 * 5. (user does and finishes AR activity)
 * 6. func createClockExperience() runs
 * 7. AR World Hidden
 * 8. VR World displayed
 * 9. Story step progresses...
 * 
 * Main CodePoints
 * line 67 in './sketch.js' for the AR -> VR space
 * line 8 & line 17 './util.js' for the hide/show VR/AR
 * 
 * Change line 90 of this.currentStep in './story.js' to 3 for starting at AR and to 4 for starting at VR. Must also hide AR element and show VR element at lines 58,59 in './sketch.js'
 */


// Main Imports
let world
let myFamilyRoom
let story
let myCanvas
let capture

console.log(localStorage.getItem('language'))

// Setup
function setup() {

    // <-----------------------> //
    // VR Space 
    noCanvas()
    world = new World('VRScene');
    world.setFlying(false)
    world.camera.cameraEl.removeAttribute('wasd-controls');
    myFamilyRoom = new FamilyRoom()
    story = new Story()
    world.setBackground(0, 0, 0);
    // <-----------------------> //
    // AR Space
    showVR(false) // hides VR
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
    // showAR(false) // uncomment both for starting at VR
    // showVR(true)
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

    console.log("Should move on now...")

    showAR(false) // hides AR
    showVR(true) // shows VR

    await sleep(1000) // simply wait

    moveNextStep() // moves onto next step in story
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
    if (story.currentStep === 3 && loaded === false) {
        screenshottedEnv = capture.get(0, 0, myCanvas.width, myCanvas.height)
        startClockExperience = true
    }
}

let loaded = false // used to load once

// Main Drawing
function draw() {

    if (story.currentStep <= 3) { // We are in AR space
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
    } else if (story.currentStep <= 12) { // we are in the VR space
        for (let i = 0; i < myFamilyRoom.allTeleportPaths.length; i++) {
            myFamilyRoom.allTeleportPaths[i].obj.animateMarker()
        }

        // Will RUN ONCE
        if (loaded === false) {
            // if reached ending
            if (story.currentStep === 12 && story.currentSubStep === 2) {
                story.currentStep = 0
                story.currentSubStep = 0
                console.log("we have ending...")
                window.location.href = '/landing.html'
            } else {
                // if some action
                if (story.steps[story.currentStep].actions.length > 0) {
                    let currentPointType = story.steps[story.currentStep].actions[story.currentSubStep]?.type
                    if (currentPointType === "discovery") {
                        updateObjectMarker(myFamilyRoom.roomPoints[myFamilyRoom.selectedPoint].name)
                    } else if (currentPointType === "dialogue" || currentPointType === "info") {
                        story.steps[story.currentStep].actions[story.currentSubStep].display()
                    }
                }
            }
            loaded = true
        }
    }
}


// VR HANDLING

// On Dialogue Next
function continueDialogue() {
    moveNextStep()
}
// Handles in object container
function handleContinueBttn() {
    moveNextStep()
}

// Moving on
function moveNextStep() {
    if (story.steps[story.currentStep].actions.length > story.currentSubStep + 1) {
        let currentAction = story.steps[story.currentStep].actions[story.currentSubStep]
        currentAction.hide()
        story.currentSubStep += 1
    } else { // moves onto next step (NOT substep)
        if ((story.steps[story.currentStep].actions.length === story.currentSubStep + 1) &&
            story.steps[story.currentStep].actions[story.currentSubStep].type !== "discovery") {
            let currentAction = story.steps[story.currentStep].actions[story.currentSubStep]
            currentAction.hide()
        }
        story.currentStep += 1
        story.currentSubStep = 0
    }
    loaded = false
}

// General Marker for clicking events
class Marker {
    constructor({ x, y, z, onClick, width = 6, height = 30 }) {

        const currentUserPos = world.getUserPosition()

        // This is for the actual click event
        const coordsAdjusted = { x: (currentUserPos.x + x) / 5, z: (currentUserPos.z + z) / 5 }
        this.clickEventObj = new Cylinder({
            x: coordsAdjusted.x,
            y: y - 28,
            z: coordsAdjusted.z,
            radius: width * 2,
            height: height,
            red: 255,
            green: 0,
            blue: 0,
            //opacity: 0.4,
            opacity: 0,
            clickFunction: function (e) {
                onClick()
            }
        })
        world.add(this.clickEventObj)
    }
}

// The teleport indacotr
class TeleportMarker extends Marker {
    constructor({ x, y, z, toLocationName }) {
        super({
            x, y, z, onClick: function (e) {
                myFamilyRoom.changeValue(toLocationName)
            }
        })

        // // A visual indicator of the marker
        this.indicator = new Container3D({
            x, y: y - 200, z,
        })

        // Bottom floor platform
        this.indicator.add(new Ring({
            y: 1,
            radiusInner: 25,
            radiusOuter: 30,
            rotationX: -90,
            red: 54, green: 54, blue: 54,
        }))
        this.indicator.add(new Circle({
            radius: 25,
            rotationX: -90,
            red: 245, green: 245, blue: 245,
        }))

        // animated top section
        this.indicator.add(new Ring({
            x: 0, y: 1, z: 0,
            radiusInner: 10,
            radiusOuter: 25,
            rotationX: -90,
            red: 133, green: 50, blue: 207,
        }))
        this.animationSpeed = 0.5

        world.add(this.indicator)
    }

    animateMarker() {

        if (frameCount % 5 === 0) {
            const maxWidth = 25
            const ringToAnimate = this.indicator.children[2]
            ringToAnimate.setRadiusInner(ringToAnimate.getRadiusInner() + this.animationSpeed)
            if (ringToAnimate.getRadiusInner() >= maxWidth || ringToAnimate.getRadiusInner() <= 0) {
                this.animationSpeed *= -1
            }

        }
    }
}

// An iSpy object to display
class ObjectMarker extends Marker {
    constructor({ x, y, z, width, height }) {
        super({
            x, y, z, onClick: function (e) { objectFound() },
            width, height
        })
        this.indicator = new Cylinder({
            x, y: y - 40, z,
            radius: width * 2,
            height: height,
            opacity: 0,
        })
        world.add(this.indicator)
    }
}

function objectFound() {
    removeObjectMaker()
    moveNextStep()
}

// Removes the ipsy object market
function removeObjectMaker() {
    world.remove(story.findingObject.indicator)
    world.remove(story.findingObject.clickEventObj)
    story.findingObject = null
}

// Updates marker based on teleport location
function updateObjectMarker(newLocation) {
    if (!!story) {
        if (!!story.findingObject) {
            removeObjectMaker()
        }

        // finds related spot to put the clickable object
        let itemToFind = story.steps[story.currentStep].actions[story.currentSubStep].item
        let relatedSpot = discoveryObjects.find(o => o.item === itemToFind).locations.find(y => y.location === newLocation)
        if (!!relatedSpot) { // should always exist but still check
            story.findingObject = new ObjectMarker({ ...relatedSpot })
        }
    }
}

const discoveryObjects = [
    {
        item: "whatnot",
        locations: [
            { location: "center", x: -300, y: 10, z: -380, width: 4, height: 30 },
            { location: "window", x: -400, y: 25, z: 210, width: 8, height: 10 },
            { location: "shelf", x: -200, y: 10, z: -90, width: 10, height: 50 },
        ]
    },
    {
        item: "sofa",
        locations: [
            { location: "window", x: 350, y: -20, z: -120, width: 30, height: 20 },
            { location: "start", x: -120, y: 5, z: -330, width: 6, height: 15 },
            { location: "center", x: -100, y: 10, z: 240, width: 6, height: 10 },
            { location: "case", x: 200, y: 15, z: -170, width: 4, height: 10 },

        ]
    },
]