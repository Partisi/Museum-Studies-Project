
// Dialogue Prompt
class Dialogue {
    constructor({ who, msg, env }) {
        this.type = "dialogue"
        this.who = who
        this.msg = msg
        this.image = '../assets/mrclock-removebg-preview.png'

        this.env = env
    }
    display() {
        console.log("DISPLAYING DIALOGUE", this.env)
        if (this.env === 'AR') {
            const overlayElement = document.getElementById('intro-dialogue')
            overlayElement.innerHTML = `
            <section id="dialogue-container">
            <div id="msg-container">    
                <p>${this.msg}</p>
            </div>
            <div id="who-container">
                <img src=${this.image} />
            </div>
           
        </section>
            `
            overlayElement.style.display = "block"
        } else {
            const overlayElement = document.getElementById('overlay-container')
            overlayElement.innerHTML = `
                <section id="dialogue-container">
                    <div id="msg-container">    
                        <p>${this.msg}</p>
                        <button onclick={continueDialogue()}>Continue</button>
                    </div>
                    <div id="who-container">
                        <img src=${this.image} />
                    </div>
                   
                </section>
            `
            overlayElement.style.display = "block"
        }

    }
    hide() {
        let overlayElement
        if (this.env === 'AR') {
            overlayElement = document.getElementById('intro-dialogue')
        } else {
            overlayElement = document.getElementById('overlay-container')
        }
        overlayElement.style.display = "none"
    }
}

class ObjectPanel {
    constructor({ objects }) {
        this.objects = objects
        this.type = "info"
    }

    display() {
        const overlayElement = document.getElementById('overlay-container')

        let centerPaneHTML = ''
        this.objects.forEach((eachObject, index) => {
            centerPaneHTML += `
                <li key=${index} class="each-pane">
                    <img src=${eachObject.image} />
                </li>
                `
        })
        overlayElement.innerHTML = `
        <section id="info-panel">
            <ul>
                ${centerPaneHTML}
            </ul>
            <button id="continue-bttn" onclick="leavePanelDisplay()">Continue</button>
        </section>
        `
        overlayElement.style.display = "block"
    }
    hide() {
        const overlayElement = document.getElementById('overlay-container')
        overlayElement.style.display = "none"
    }
}
function leavePanelDisplay() {
    console.log("should leave pnael display")
}

// Info that is displayed when object is found
class ObjectInfo {
    constructor({ name, header, description, image, imageAlt, imageCaption }) {
        this.type = "info"
        this.name = name
        this.header = header
        this.description = description
        // this.image = image
        this.image = image
        this.imageAlt = imageAlt
        this.imageCaption = imageCaption
    }
}


const stepsAR = [
    { // Clicked enter and clock gives introduction
        id: 0,
        actions: [
            new Dialogue({ who: "Clock", env: 'AR', msg: "Hello! My name is Clementine. I am a dark brown wooden clock shaped like a pentagon and my size is slightly bigger than a cereal box. I am simple and sturdy, and decorated with an inlaid butterfly" }),
            new Dialogue({ who: "Clock", env: 'AR', msg: "I have lived here since the Tredwells first moved into the house in 1835. After the youngest daughter Gertrude passed away in 1933, I watched as this house turned into a museum, preserving its historical past." }),
            new Dialogue({ who: "Clock", env: 'AR', msg: "I'm bored watching people go by; let’s play a game to pass the time! I want to introduce my friends to you, but they’re shy. If you can solve some of my riddles, they’re happy to meet you!" })

        ]
    },
    { // the AR experience w/ camera is enabled
        id: 1,
        actions: []
    },
]

const stepsVR = [
    { // Initial Entry into VR, clock speaks
        id: 0,
        actions: [
            new Dialogue({ who: "Clock", env: 'VR', msg: "I want to introduce some of my old friends to you! But they’re shy. If you can solve the riddle I’m about to give you, they’re happy to meet you!" }),
            new Dialogue({ who: "Clock", env: 'VR', msg: "My friend may look wobbly but is stronger than you think. They can store your tableware, but not your food and drink. Can you find them?" })
        ]
    },
    { // user is searching for american shelf
        id: 1,
        actions: [
            { type: "discovery", item: "whatnot" }
        ],
    },
    { // User has clicked on the american shelf (whatnot) thing
        id: 2,
        actions: [
            new Dialogue({ who: "Clock", env: 'VR', msg: "Great job, you found the American Whatnot!" }),
            new Dialogue({ who: "Clock", env: 'VR', msg: "Click the magnifiers to zoom in on the information!" })
        ]
    },
    { // On click of information, displays information
        id: 3,
        actions: [
            new ObjectPanel({
                objects: [
                    new ObjectInfo({
                        header: "What’s a What-not?",
                        description: "The American whatnot is a fancy carved shelf that was fashionable during the first half of the 1800s. It was often used to display decorative objects such as china, ornaments, or “what-not.” <br />This what-not has been here since the 1800s: when this photo was taken in the 1940s, it was mainly used to display glassware in the family room.",
                        image: '../assets/objects/shelf1.png',
                        imageAlt: "A 5-tiered, delicately carved wooden shelf, approximately 5’2” or 160 cm high, holding a number of glass objects such as vases, cups, and bowls.",
                        imageCaption: "A black and white image of a carved mahogany shelf, roughly the height of a standard fridge, held up by thin, curvy, wooden dowels. With its smooth and glossy finish, the what-not is usually finely crafted to display expensive ornaments."
                    }),
                    new ObjectInfo({
                        header: "The Lives of the Irish servants",
                        description: "Households like the Tredwells’ typically had four servants: a cook, kitchen helper, parlor maid, and a “second girl” who assisted with cleaning. The servants usually got up before dawn to prepare for the day. <br /> While the cook started breakfast, the kitchen maid set the table in the family room. The parlor maid and the “second girl” tidied the rooms, dusting furniture such as the what-not.",
                        image: '../assets/objects/shelf2.png',
                        imageAlt: "A woman wearing a maid’s dress, apron, and bonnet, sweeps the floor of a room. Behind her a small table holds a vase of flowers.",
                        imageCaption: "A black and white drawing of a maid cleaning the floor of a front parlor. She pauses in the middle of her work with a somber expression."
                    })
                ]
            })
        ]
    },
    { // returns back to room
        id: 4,
        actions: [
            new Dialogue({ who: "Clock", env: 'VR', msg: "Let’s go find my other friends!" }),
            new Dialogue({ who: "Clock", env: 'VR', msg: "My other friend stands without knees; they are well made with care and expertise, so when you’re with them you may feel at ease. Can you find them?" })
        ]
    },
    { // user is searching for sofa
        id: 5,
        actions: [
            { type: "discovery", item: "sofa" }
        ]
    },
    { // User has clicked on the federal sofa
        id: 6,
        actions: [
            new Dialogue({ who: "Clock", env: 'VR', msg: "Great job, you found the Federal Sofa!" }),
            new Dialogue({ who: "Clock", env: 'VR', msg: "Click the magnifiers to zoom in on the information!" })
        ]
    },
    { // On click of information, displays information
        id: 7,
        actions: [
            new ObjectPanel({
                objects: [
                    new ObjectInfo({
                        header: "Some sofa header",
                        description: "This 1820’s red silk sofa is an example of the Federal style of massive, bold, and elaborately carved furniture. Sometimes this style of furniture would showcase American nationalistic symbols like the eagle here.<br></br> The Tredwells brought this sofa from their first home on Dey Street in 1835. When they redecorated in 1850, they moved this sofa to the downstairs family room as by that time it was out of style.",
                        image: null,
                        imageAlt: "",
                        imageCaption: "This is a red silk sofa..."
                    }),
                    new ObjectInfo({
                        header: "A typical day in the family room",
                        description: "This room served as an informal sitting room, where they engaged in private activities such as family dinners, reading, playing, or schoolwork. Since the ceilings in the basement were lower than the rest of the house, it was the warmest floor in the winter when the only source of heat was the coal fireplace. A half story below ground, it was also cooler than the rest of the house in hot weather. This made it the perfect place to take a nap!",
                        image: null,
                        imageAlt: "",
                        imageCaption: "",
                    })
                ]
            })
        ],
    },
    { // returns back to room
        id: 8,
        actions: [
            new Dialogue({ who: "Clock", env: 'VR', msg: "Great job, you found everything!" }),
            new Dialogue({ who: "Clock", env: 'VR', msg: "Goodbye!" }),
            null
        ]
    },
]

/**
 * Main Flow Object
 * Basically, each action or step in the entire app is logged here with
 * currentStep and currentSubStep being the current indexes of where the 
 * user is currently located at
 */
class Story {
    constructor(steps) {
        this.currentStep = 0 // current step (3 for AR start, 4 for VR start)
        this.currentSubStep = 0 // index of dialogue
        this.steps = [] // master concat of all steps

        this.findingObject = null // if user is searching for object

        this.steps = steps
    }
}