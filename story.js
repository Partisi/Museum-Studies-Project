
// Dialogue Prompt
class Dialogue {
    constructor({ who, msg, env }) {
        this.type = "dialogue"
        this.who = who
        this.msg = msg
        this.image = '../assets/mrclock.png'

        this.env = env
    }
    display() {
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

        stopAllAudio()

        let centerPaneHTML = ''
        this.objects.forEach((eachObject, index) => {
            const objectInfo = Object.assign({}, ...Object.getOwnPropertyNames(eachObject).map(o => { return { [o]: eachObject[o] } }))
            centerPaneHTML += `
                <li key=${index} class="each-pane" >
                    <img class="magnify-icon" src="../assets/searchicon.png" />
                    <div class="panel-frame">
                        <div class="outer-box">
                            <div class="inner-box">
                                <img src=${objectInfo.image} onclick={viewSingleInfo('${encodeURIComponent(JSON.stringify(objectInfo))}')} />
                            </div>
                        </div>
                    </div>
                </li>
                `
        })
        overlayElement.innerHTML = `
        <div class="blur-background"></div>
        <section id="info-panel">
            <ul>
                ${centerPaneHTML}
            </ul>
            <button id="continue-bttn" onclick="handleContinueBttn()"><p>Continue</p><img src="../assets/nexticon.png" /></button>
        </section>
        `
        overlayElement.style.display = "block"
    }
    hide() {
        const overlayElement = document.getElementById('overlay-container')
        overlayElement.style.display = "none"
    }
}

function viewSingleInfo(infoToDisplay) {
    const objParsed = JSON.parse(decodeURIComponent(infoToDisplay))
    const overlayElement = document.getElementById('overlay-container')
    overlayElement.innerHTML = `
        <div class="blur-background"></div>
        <img id="info-frame" src="../assets/frame.png" />
        <section id="object-info-container">
            <button class="button-go-back" onclick={goBack()}>
                <p>Go Back</p>
            </button>
            <button id="mute-bttn" onclick="toggleMute()"><img src="${audioIcon()}" /></button>
            <div class="top-info">
                <img src=${objParsed.image} alt=${objParsed.imageAlt} />
                <p>${objParsed.imageCaption}</p>
            </div>
            <div class="bottom-info">
                <h2>${objParsed.header}</h2>
                <p class="desc">${objParsed.description}</p>
            </div>
        </section>
        `
}
function audioIcon() {
    if (sounds.muted) {
        return "../assets/mute.svg"
    } else {
        return "../assets/speaker.svg"
    }
}
function toggleMute() {
    sounds.muted = !sounds.muted
    const soundElem = document.getElementById('mute-bttn').getElementsByTagName('img')[0]
    console.log(soundElem)
    soundElem.src = audioIcon()
}

function goBack() {
    console.log("should go back")
    storyVR.steps[storyVR.currentStep].actions[storyVR.currentSubStep].display()
}

// Info that is displayed when object is found
class ObjectInfo {
    constructor({ header, description, image, imageAlt, imageCaption }) {
        this.type = "info"
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
            new Dialogue({ who: "Clock", env: 'AR', msg: "I'm bored watching people go by; let’s play a game to pass the time!" })

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
                        header: "An Out-of-Fashion Icon",
                        description: "This 1820’s red silk sofa is an example of the Federal style of massive, bold, and elaborately carved furniture. Sometimes this style of furniture would showcase American nationalistic symbols like the eagle here. <br /> The Tredwells brought this sofa from their first home on Dey Street in 1835. When they redecorated in 1850, they moved this sofa to the downstairs family room as by that time it was out of style.",
                        image: "../assets/objects/sofa1.png",
                        imageAlt: "The left-side of a floral patterned sofa which is approximately 3’ or 90 cm high, 4’4” or 130 cm wide. A tubular cushion rests against its curved arm.",
                        imageCaption: "A zoomed in, black and white photo of a silk sofa with carved feet shaped like an eagle in flight."
                    }),
                    new ObjectInfo({
                        header: "A Typical Day in the Family Room",
                        description: "This room served as an informal sitting room, where they engaged in private activities such as family dinners, reading, or schoolwork. <br /> Since the basement’s ceilings were lower than the rest of the house, it was the warmest floor during winter when the only source of heat was the fireplace. A half story below ground, it was also cooler in hot weather. This made it the perfect place to take a nap!",
                        image: "../assets/objects/sofa2.png",
                        imageAlt: "A drawing of a family sitting and chatting around the dining table.",
                        imageCaption: "A drawing rendered in black and white of seven family members, sitting at a dining table covered in a white tablecloth. They are drinking tea and chatting to one another animatedly.",
                    }),
                    new ObjectInfo({
                        header: "Naps and Nightcaps",
                        description: "",
                        image: "../assets/objects/sofa3.png",
                        imageAlt: "Two diary entries of John Drake Skidmore.",
                        imageCaption: "The diary entries of John Drake Skidmore, written in 1858. He was a 28-year old neighbor to the Tredwells, who often wrote about the activities in his own family room in his diary.",
                    }),
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