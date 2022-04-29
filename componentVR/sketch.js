
// Main Imports
let world
let myFamilyRoom
let storyVR
const sounds = {
    muted: false,
    dialogue: [],
}


// Setup
function setup() {

    sounds.fireplace = loadSound('../audio/misc/fireplace.wav')
    sounds.teleport = loadSound('../audio/misc/teleport.wav')
    sounds.teleport.setVolume(0.1)
    sounds.chatter = loadSound('../audio/misc/chatter.wav')
    sounds.laugh = loadSound('../audio/misc/laugh.wav')
    sounds.street = loadSound('../audio/misc/street.wav')
    sounds.horseNeigh = loadSound('../audio/misc/horseneigh.wav')
    sounds.horseWalk = loadSound('../audio/misc/horseoutside.wav')

    sounds.found = loadSound('../audio/misc/found.wav')

    sounds.dialogue[0] = loadSound('../audio/dialogue_prompts_voice/4myfriendmaylookwobbly.m4a')
    sounds.dialogue[1] = loadSound('../audio/dialogue_prompts_voice/5greatjob.m4a')
    sounds.dialogue[2] = loadSound('../audio/dialogue_prompts_voice/6clickthemag.m4a')
    sounds.dialogue[3] = loadSound('../audio/dialogue_prompts_voice/7letsgofind.m4a')
    sounds.dialogue[4] = loadSound('../audio/dialogue_prompts_voice/8myotherfriend.m4a')
    sounds.dialogue[5] = loadSound('../audio/dialogue_prompts_voice/9greatjob.m4a')
    sounds.dialogue[6] = loadSound('../audio/dialogue_prompts_voice/10clickthemag.m4a')
    sounds.dialogue[7] = loadSound('../audio/dialogue_prompts_voice/11thanksforplaying.m4a')

    // <-----------------------> //
    // VR Space 
    storyVR = new Story(stepsVR)

    noCanvas()
    world = new World('VRScene');
    world.setFlying(false)
    world.camera.cameraEl.removeAttribute('wasd-controls');
    myFamilyRoom = new FamilyRoom()
    world.setBackground(0, 0, 0);
}

let loaded = false // used to load once

// Main Drawing
async function draw() {

    for (let i = 0; i < myFamilyRoom.allTeleportPaths.length; i++) {
        myFamilyRoom.allTeleportPaths[i].obj.animateMarker()
    }

    // Will RUN ONCE
    if (loaded === false && window.parent.inStateVR) {

        // if first time running
        if (storyVR.currentStep === 0 && storyVR.currentSubStep === 0) {
            sounds.muted = parse(localStorage.getItem('muted'))
            console.log(sounds.muted)
        }

        // if reached ending
        if (storyVR.currentStep === 8 && storyVR.currentSubStep === 2) {
            storyVR.currentStep = 0
            storyVR.currentSubStep = 0
            console.log("we have ending...")
            window.location.href = '/index.html'
        } else {
            // if some action
            if (storyVR.steps[storyVR.currentStep].actions.length > 0) {
                let currentPointType = storyVR.steps[storyVR.currentStep].actions[storyVR.currentSubStep]?.type
                if (currentPointType === "discovery") {
                    updateObjectMarker(myFamilyRoom.roomPoints[myFamilyRoom.selectedPoint].name)
                } else if (currentPointType === "dialogue" || currentPointType === "info") {
                    if (currentPointType === "dialogue") sounds.dialogue[storyVR.steps[storyVR.currentStep].actions[storyVR.currentSubStep].audioIndex].play()
                    storyVR.steps[storyVR.currentStep].actions[storyVR.currentSubStep].display()
                }
            }
        }
        loaded = true
    }
}

function playAudioDependingOnLocation(currentLocation) {

    // Turns off all sounds
    stopAllAudio()

    if (sounds.muted) {
        return
    }

    sounds.teleport.setVolume(0.1)
    sounds.teleport.play()

    if (currentLocation === 'start') {
        allDiningSounds(0.01)
    }

    if (currentLocation === 'case') {
        allDiningSounds(0.004)
        sounds.fireplace.setVolume(0.07)
        sounds.fireplace.play()
        sounds.fireplace.setLoop(true)
    }

    if (currentLocation === 'center') {
        allStreetSounds(0.002)
        allDiningSounds(0.002)
        sounds.fireplace.setVolume(0.1)
        sounds.fireplace.play()
        sounds.fireplace.setLoop(true)
    }

    if (currentLocation === "shelf") {
        sounds.fireplace.setVolume(0.07)
        sounds.fireplace.play()
        sounds.fireplace.setLoop(true)

        allStreetSounds(0.006)
    }
    if (currentLocation === "window") {
        allStreetSounds(0.006)
    }

    function allDiningSounds(volume) {
        sounds.chatter.setVolume(volume)
        sounds.chatter.play()
        sounds.chatter.setLoop(true)
        sounds.chatter.addCue(random(8, 16), () => {
            sounds.laugh.setVolume(volume)
            sounds.laugh.play()
        })
    }
    function allStreetSounds(volume) {
        sounds.street.setVolume(volume)
        sounds.street.play()
        sounds.street.setLoop(true)
        sounds.street.addCue(random(6, 10), () => {
            sounds.horseNeigh.setVolume(volume)
            sounds.horseNeigh.play()
        })
        sounds.street.addCue(random(8, 10), () => {
            sounds.horseWalk.setVolume(volume / 2)
            sounds.horseWalk.play()
        })
    }
}
function stopAllAudio() {
    for (const [key, _] of Object.entries(sounds)) {
        if (sounds[key]._playing) {
            sounds[key].stop()
            sounds[key].clearCues()
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
    if (storyVR.steps[storyVR.currentStep].actions.length > storyVR.currentSubStep + 1) {
        let currentAction = storyVR.steps[storyVR.currentStep].actions[storyVR.currentSubStep]
        currentAction.hide()
        storyVR.currentSubStep += 1
    } else { // moves onto next step (NOT substep)
        if ((storyVR.steps[storyVR.currentStep].actions.length === storyVR.currentSubStep + 1) &&
            storyVR.steps[storyVR.currentStep].actions[storyVR.currentSubStep].type !== "discovery") {
            let currentAction = storyVR.steps[storyVR.currentStep].actions[storyVR.currentSubStep]
            currentAction.hide()
            playAudioDependingOnLocation(myFamilyRoom.roomPoints[myFamilyRoom.selectedPoint].name)
        }
        storyVR.currentStep += 1
        storyVR.currentSubStep = 0
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
            x: 0, y: 2, z: 0,
            radiusInner: 10,
            radiusOuter: 28,
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
    world.remove(storyVR.findingObject.indicator)
    world.remove(storyVR.findingObject.clickEventObj)
    storyVR.findingObject = null
}

// Updates marker based on teleport location
function updateObjectMarker(newLocation) {
    if (!!storyVR) {
        if (!!storyVR.findingObject) {
            removeObjectMaker()
        }

        // finds related spot to put the clickable object
        let itemToFind = storyVR.steps[storyVR.currentStep].actions[storyVR.currentSubStep].item
        let relatedSpot = discoveryObjects.find(o => o.item === itemToFind).locations.find(y => y.location === newLocation)
        if (!!relatedSpot) { // should always exist but still check
            storyVR.findingObject = new ObjectMarker({ ...relatedSpot })
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