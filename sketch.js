// Main

// Main Inits

// options for scaling
// 1. photoshop individual objects
// 2. recolor sky spehre specific objects and just switch out
// 3. use ray tracing (interactiove dynamic texture) and draw on skysphere which is a canvas
//          draw img onto canvas and just draw

let world

let buffer1
let texture1

let imgWidth = 6080
let imgHeight = 3040

let myFamilyRoom
let story


// Setup
function setup() {
    // no main canvas - we will just use our off screen graphics buffers to hold our dynamic textures
    noCanvas();

    // let myCanvas = createCanvas(800, 480)
    // myCanvas.parent('#myCanvas')
  
    // // Setting up camera
    // capture = createCapture(VIDEO)
    // capture.size(width, height)

    // construct the A-Frame world
    // this function requires a reference to the ID of the 'a-scene' tag in our HTML document
    world = new World('VRScene');
    world.setFlying(false)
    world.camera.cameraEl.removeAttribute('wasd-controls');

    myFamilyRoom = new FamilyRoom()
    story = new Story()

    // set the background color of the world
    world.setBackground(0, 0, 0);

    // create our off screen graphics buffer & texture
    let myFactor = 4
    buffer1 = createGraphics(imgWidth / myFactor, imgHeight / myFactor);
    texture1 = world.createDynamicTextureFromCreateGraphics(buffer1);
    buffer1.ellipse(0, 0, 50, 50)
    buffer1.clear()
    let skySphere = new Sphere({
        x: 0, y: 0, z: 0,
        radius: 100,
        asset: texture1,
        dynamicTexture: true,
        transparent: true,
        dynamicTextureWidth: imgWidth / myFactor,
        dynamicTextureHeight: imgHeight / myFactor,
        overFunction: function (entity, intersectionInfo) {
            // intersectionInfo is an object that contains info about how the user is
            // interacting with this entity.  it contains the following info:
            // .distance : a float describing how far away the user is
            // .point3d : an object with three properties (x, y & z) describing where the user is touching the entity
            // .point2d : an object with two properites (x & y) describing where the user is touching the entity in 2D space (essentially where on the dynamic canvas the user is touching)
            // .uv : an object with two properies (x & y) describing the raw textural offset (used to compute point2d)

            // draw an ellipse at the 2D intersection point on the dynamic texture

            // buffer1.fill(random(255), random(255), random(255));
            // buffer1.ellipse(intersectionInfo.point2d.x, intersectionInfo.point2d.y, 20, 20);
            // console.log("here");
            // console.log(intersectionInfo.point2d.x, intersectionInfo.point2d.y)
        }
    });
    world.add(skySphere);

}

let loaded = false
function draw() {
    // buffer1.image(myImage, 0, 0)
    // buffer1.fill('red')
    // buffer1.ellipse(random(0, imgWidth / 2), random(0, imgHeight / 2), 50, 50)
    // background("#fa5cff")


    // Will RUN ONCE
    if (loaded === false) {
        // if reached ending
        if (story.currentStep + 1 > story.steps.length) {
            console.log("reached end!")
            story.currentStep = 0
            story.currentSubStep = 0
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
            opacity: 0.4,
            // opacity: 0,
            clickFunction: function (e) {
                onClick()
            }
        })
        world.add(this.clickEventObj)
    }
}

class TeleportMarker extends Marker {
    constructor({ x, y, z, toLocationName }) {
        super({
            x, y, z, onClick: function (e) {
                myFamilyRoom.changeValue(toLocationName)
            }
        })

        // // A visual indicator of the marker
        this.indicator = new Cylinder({
            x, y: y - 200, z,
            radius: 30,
            height: 1,
        })
        world.add(this.indicator)
    }
}

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
            red: 255,
            green: 255,
            blue: 0,
        })
        world.add(this.indicator)
    }
}

function objectFound() {
    removeObjectMaker()
    moveNextStep()
}

function removeObjectMaker() {
    world.remove(story.findingObject.indicator)
    world.remove(story.findingObject.clickEventObj)
    story.findingObject = null
}
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