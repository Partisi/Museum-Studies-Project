
// Pre Loads
const myImages = {}
function preload() {
    myImages.cat = loadImage('./assets/cat.jpeg')
    console.log(myImages)
}

// Dialogue Prompt
class Dialogue {
    constructor({ who, msg }) {
        this.type = "dialogue"
        this.who = who
        this.msg = msg
        this.image = './assets/mrclock-removebg-preview.png'
    }
    display() {
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
    hide() {
        const overlayElement = document.getElementById('overlay-container')
        overlayElement.style.display = "none"
    }
}

// Info that is displayed when object is found
class ObjectInfo {
    constructor({ name, header, description, image, imageAlt, imageCaption }) {
        this.type = "info"
        this.name = name
        this.header = header
        this.description = description
        // this.image = image
        this.image = './assets/cat.jpeg'
        this.imageAlt = imageAlt
        this.imageCaption = imageCaption
    }
    display() {
        const overlayElement = document.getElementById('overlay-container')
        overlayElement.classList.add('blur-background')
        overlayElement.innerHTML = `
        <section id="object-info-container">
            <div class="top-info">
                <img src=${this.image} alt=${this.imageAlt} />
                <p>${this.imageCaption}</p>
            </div>
            <div class="bottom-info">
                <h2>${this.header}</h2>
                <p class="desc">${this.description}</p>
                <button class="button-continue" onclick={handleContinueBttn()}>
                    <p>Continue</p>
                    <div class="button-border button-border-left"></div>
                    <div class="button-border button-border-top"></div>
                    <div class="button-border button-border-right"></div>
                    <div class="button-border button-border-bottom"></div>
                </button>
            </div>
        </section>
        `
        overlayElement.style.display = "block"
    }
    hide() {
        const overlayElement = document.getElementById('overlay-container')
        overlayElement.classList.remove('blur-background')
        overlayElement.style.display = "none"
    }
}

/**
 * Main Flow Object
 * Basically, each action or step in the entire app is logged here with
 * currentStep and currentSubStep being the current indexes of where the 
 * user is currently located at
 */
class Story {
    constructor() {
        this.currentStep = 3 // current step (3 for AR start, 4 for VR start)
        this.currentSubStep = 0 // index of dialogue
        this.steps = [] // master concat of all steps

        this.findingObject = null // if user is searching for object

        // Main
        this.stepsMain = [
            { // is at landing page, nothing yet
                id: 0,
                actions: []
            },
        ]

        // AR Space
        this.stepsAR = [
            { // Clicked enter and clock gives introduction
                id: 1,
                actions: [
                    new Dialogue({ who: "Clock", msg: "Hello! My name is Clementine, I have lived here since the Tredwells first moved into the house in 1835..." }),
                    new Dialogue({ who: "Clock", msg: "Let’s go explore the Downstairs Family Room. Use your phone to scan around the space and click on the appearing..." })
                ]
            },
            { // the AR experience w/ camera is enabled
                id: 2,
                actions: []
            },
            { // Screenshot taken and displaying animations
                id: 3,
                actions: []
            },
        ]

        // VR Space
        this.stepsVR = [
            { // Initial Entry into VR, clock speaks
                id: 4,
                actions: [
                    new Dialogue({ who: "Clock", msg: "I want to introduce some of my old friends to you! But they’re shy. If you can solve the riddle I’m about to give you, they’re happy to meet you!" }),
                    new Dialogue({ who: "Clock", msg: "My friend may look wobbly but is stronger than you think. They can store your tableware, but not your food and drink. Can you find them?" })
                ]
            },
            { // user is searching for american shelf
                id: 5,
                actions: [
                    { type: "discovery", item: "whatnot" }
                ],
            },
            { // User has clicked on the american shelf (whatnot) thing
                id: 6,
                actions: [
                    new Dialogue({ who: "Clock", msg: "Great job, you found the American Whatnot!" }),
                    new Dialogue({ who: "Clock", msg: "Click the magnifiers to zoom in on the information!" })
                ]
            },
            { // On click of information, displays information
                id: 7,
                actions: [
                    new ObjectInfo({
                        name: "",
                        header: "What’s a What-not?",
                        description: "The American whatnot is a fancy carved shelf that was fashionable during the first half of the 1800s. It was often used to display decorative objects such as china, ornaments, or “what-not.”",
                        image: myImages.cat,
                        imageAlt: "What-not shelf in the 1940’s",
                        imageCaption: "This was here since the 1800s: when this photo was taken in the 1940s, it was mainly used to display glassware in the family room."
                    }),
                    new ObjectInfo({
                        name: "",
                        header: "Let’s dive into the designer’s mind!",
                        description: "As shown in this photo, the shelf is made up of elaborate hand carvings, which can also be seen on the",
                        image: myImages.cat,
                        imageAlt: "",
                        imageCaption: "This diagram shows the artistry of the top shelf’s carving."
                    })
                ]
            },
            { // returns back to room
                id: 8,
                actions: [
                    new Dialogue({ who: "Clock", msg: "Let’s go find my other friends!" }),
                    new Dialogue({ who: "Clock", msg: "My other friend stands without knees; they are well made with care and expertise, so when you’re with them you may feel at ease. Can you find them?" })
                ]
            },
            { // user is searching for sofa
                id: 9,
                actions: [
                    { type: "discovery", item: "sofa" }
                ]
            },
            { // User has clicked on the federal sofa
                id: 10,
                actions: [
                    new Dialogue({ who: "Clock", msg: "Great job, you found the Federal Sofa!" }),
                    new Dialogue({ who: "Clock", msg: "Click the magnifiers to zoom in on the information!" })
                ]
            },
            { // On click of information, displays information
                id: 11,
                actions: [
                    new ObjectInfo({
                        name: "",
                        header: "Some sofa header",
                        description: "This 1820’s red silk sofa is an example of the Federal style of massive, bold, and elaborately carved furniture. Sometimes this style of furniture would showcase American nationalistic symbols like the eagle here.<br></br> The Tredwells brought this sofa from their first home on Dey Street in 1835. When they redecorated in 1850, they moved this sofa to the downstairs family room as by that time it was out of style.",
                        image: myImages.cat,
                        imageAlt: "",
                        imageCaption: "This is a red silk sofa..."
                    }),
                    new ObjectInfo({
                        name: "",
                        header: "A typical day in the family room",
                        description: "This room served as an informal sitting room, where they engaged in private activities such as family dinners, reading, playing, or schoolwork. Since the ceilings in the basement were lower than the rest of the house, it was the warmest floor in the winter when the only source of heat was the coal fireplace. A half story below ground, it was also cooler than the rest of the house in hot weather. This made it the perfect place to take a nap!",
                        image: myImages.cat,
                        imageAlt: "",
                        imageCaption: "",
                    })
                ],
            },
            { // returns back to room
                id: 12,
                actions: [
                    new Dialogue({ who: "Clock", msg: "Great job, you found everything!" }),
                    new Dialogue({ who: "Clock", msg: "Goodbye!" }),
                    null
                ]
            },
        ]

        // Just combines all substeps into a single list
        this.steps = this.steps.concat(this.stepsMain, this.stepsAR, this.stepsVR)
    }
}