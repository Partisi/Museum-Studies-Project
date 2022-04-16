// Main

// Main Inits

// options for scaling
// 1. photoshop individual objects
// 2. recolor sky spehre specific objects and just switch out
// 3. use ray tracing (interactiove dynamic texture) and draw on skysphere which is a canvas
//          draw img onto canvas and just draw

let world

let myFamilyRoom = null
class FamilyRoom {
    constructor() {
        this.selectedPoint = 0
        this.roomPoints = [
            {
                id: 0,
                name: "start",
                asset: "r_start_1",
                teleportPaths: [
                    { x: 20, y: 0, z: 0, to: "center" },
                ]
            },
            {
                id: 1,
                name: "center",
                asset: "r_center_1",
                teleportPaths: [
                ]
            },
            {
                id: 2,
                name: "case",
                asset: "r_case_1",
                teleportPaths: [
                ]
            },
            {
                id: 3,
                name: "fireplace",
                asset: "r_fire_1",
                teleportPaths: [
                ]
            },
            {
                id: 4,
                name: "shelf",
                asset: "r_shelf_1",
                teleportPaths: [
                ]
            },
            {
                id: 5,
                name: "window",
                asset: "r_window_1",
                teleportPaths: [
                ]
            },
        ]
        this.sky = new Sky({ asset: this.roomPoints[this.selectedPoint].asset })
        world.add(this.sky)
        this.allTeleportPaths = []
        this.initiateTeleportPads()
    }
    changeValue(toName) {
        let foundNewRoomInfo = this.roomPoints.find(o => o.name === toName)
        this.selectedPoint = foundNewRoomInfo.id
        this.sky.setAsset(foundNewRoomInfo.asset)
        this.updateTeleportPads()
    }
    initiateTeleportPads() {
        this.roomPoints.forEach(eachRoom => {
            console.log(eachRoom)
            eachRoom.teleportPaths.forEach(eachTeleportLocation => {
                console.log(eachTeleportLocation)
                this.allTeleportPaths.push({
                    obj: new TeleportMarker({
                        x: eachTeleportLocation.x,
                        y: eachTeleportLocation.y,
                        z: eachTeleportLocation.z,
                        toLocationName: eachTeleportLocation.to
                    }),
                    id: eachRoom.id
                })
            })
        })
        this.updateTeleportPads()
    }
    updateTeleportPads() {
        console.log(this.allTeleportPaths)
        this.allTeleportPaths.forEach(eachTeleportPath => {
            if (eachTeleportPath.id !== this.selectedPoint) {
                eachTeleportPath.obj.obj.hide()
            } else {
                eachTeleportPath.obj.obj.show()
            }
        })
    }
}
let buffer1
let texture1

let imgWidth = 6080
let imgHeight = 3040


// Setup
function setup() {
    // no main canvas - we will just use our off screen graphics buffers to hold our dynamic textures
    noCanvas();

    // construct the A-Frame world
    // this function requires a reference to the ID of the 'a-scene' tag in our HTML document
    world = new World('VRScene');

    myFamilyRoom = new FamilyRoom()

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

function draw() {
    // buffer1.image(myImage, 0, 0)
    // buffer1.fill('red')
    // buffer1.ellipse(random(0, imgWidth / 2), random(0, imgHeight / 2), 50, 50)
}

class TeleportMarker {
    constructor({ x, y, z, toLocationName }) {
        console.log('creating this...', x, y, z, toLocationName)
        this.obj = new Sphere({
            x, y, z,
            width: 1,
            depth: 1.5,
            height: 1.2,
            red: 255,
            green: 0,
            blue: 0,
            clickFunction: function (e) {
                console.log("Clicked!!!")
                console.log(toLocationName)
                myFamilyRoom.changeValue(toLocationName)
            }
        })
        world.add(this.obj)
        console.log("added!")
    }
}
