// Main

// Main Inits
let world

const roomPoints = [
    { name: "point1", asset: "church" },
    { name: "point2", asset: "room" },
]

const markers = []

// Setup
function setup() {
    noCanvas()

    // Init World
    world = new World('VRScene')
    world.setBackground(0, 0, 0)
    world.add(new Sky({ asset: 'church' }))

    world.setFlying(true)

    markers.push(new Marker({ x: 0, y: 3, z: 0, name: "Something", description: "Idk" }))
}

// Main Draw
function draw() {
    for (let i = 0; i < markers.length; i++) {

    }
}

class Marker {
    constructor({ x, y, z, name, description }) {
        this.obj = new Box({
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
}