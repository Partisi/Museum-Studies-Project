// Main

// Main Inits

// options for scaling
// 1. photoshop individual objects
// 2. recolor sky spehre specific objects and just switch out
// 3. use ray tracing (interactiove dynamic texture) and draw on skysphere which is a canvas
//          draw img onto canvas and just draw
let world
let myImage = null

const roomPoints = [
    { name: "point1", asset: "church" },
    { name: "point2", asset: "room" },
]

const markers = []

let buffer1
let texture1

let imgWidth = 6080
let imgHeight = 3040

let myFactor = 2

// Setup
function setup() {
    // no main canvas - we will just use our off screen graphics buffers to hold our dynamic textures
    noCanvas();

    // construct the A-Frame world
    // this function requires a reference to the ID of the 'a-scene' tag in our HTML document
    world = new World('VRScene');

    // set the background color of the world
    world.setBackground(0, 0, 0);

    myImage = loadImage('./assets/roomtest.JPG')

    // create our off screen graphics buffer & texture
    buffer1 = createGraphics(imgWidth / myFactor, imgHeight / myFactor);
    texture1 = world.createDynamicTextureFromCreateGraphics(buffer1);
    buffer1.ellipse(0, 0, 50, 50)
    // buffer1.background(0)
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

    world.add(new Sky({
        asset: "roomtest",
    }))
    world.add(skySphere);

}

function draw() {
    // buffer1.image(myImage, 0, 0)
    // buffer1.fill('red')
    // buffer1.ellipse(random(0, imgWidth / 2), random(0, imgHeight / 2), 50, 50)
}


// var startColor = color(
//     floor(random(255)),
//     floor(random(255)),
//     floor(random(255))
// );
// var endColor = color(
//     floor(random(255)),
//     floor(random(255)),
//     floor(random(255))
// );

class Marker {
    constructor({ x, y, z, name, description }) {
        this.obj = new Sphere({
            x, y, z,
            width: 1,
            depth: 1.5,
            height: 1.2,
            red: 255,
            green: 0,
            blue: 0,
            clickFunction: function (e) {
                if (e.getOpacity() === 0) {
                    console.log("UNCOVERED!")
                    console.log(name, description)
                    e.setOpacity(1)
                } else {
                    e.setOpacity(0)
                }

            }
        })
        world.add(this.obj)
    }
    display() {
        this.obj.scale()
        if (frameCount % 240 === 0) {
            console.log("YUP")
            // this.obj.color(lerpColor(startColor, endColor, 0))
        }
    }
}