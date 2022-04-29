
const languageSelections = [
    'english',
    'spanish'
]
let language = languageSelections[0]
localStorage.setItem('language', language)

function changeLanguage(selection) {
    language = selection

    document.getElementById(selection).classList.add('button-selected')
    document.getElementById(selection).classList.remove('button-unselected')

    document.getElementById(languageSelections.find(o => o !== selection)).classList.add('button-unselected')
    document.getElementById(languageSelections.find(o => o !== selection)).classList.remove('button-selected')

    localStorage.setItem('language', selection)
}

// Simple Sleeper function to wait for execution
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let muted = localStorage.getItem('muted') === undefined ? false : parse(localStorage.getItem('muted'))

function changeMuted() {
    muted = !muted
    localStorage.setItem('muted', muted)
    document.getElementById('mute-settings').getElementsByTagName('img')[0].src = audioIcon(true)
}

function audioIcon(callingFromParent = false) {
    console.log(muted)
    if (muted) {
        if (callingFromParent) {
            return "./assets/mute.svg"
        } else {
            return "../assets/mute.svg"
        }
    } else {
        if (callingFromParent) {
            return "./assets/speaker.svg"
        } else {
            return "../assets/speaker.svg"
        }
    }
}

function parse(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
}