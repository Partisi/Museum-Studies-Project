
// Language Handling
const languageSelections = [
    'english',
    'spanish'
]
let language = languageSelections[0] // default language
localStorage.setItem('language', language) // sets in local storage

// Depending on language change, shows correct icon and saves in local storage
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

// If local storage has muted
let muted = localStorage.getItem('muted') === undefined ? false : parse(localStorage.getItem('muted'))

// Handling muted icons and sets in storage
function changeMuted() {
    muted = !muted
    localStorage.setItem('muted', muted)
    document.getElementById('mute-settings').getElementsByTagName('img')[0].src = audioIcon(true)
}

// Retursn the appropiate auido icon
function audioIcon(callingFromParent = false) {
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

// Parse from local storage
function parse(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
}