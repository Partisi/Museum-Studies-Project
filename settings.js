
const languageSelections = [
    'english',
    'spanish'
]
let language = languageSelections[0]
localStorage.setItem('language', language)

function changeLanguage(selection) {
    console.log(selection)
    language = selection

    document.getElementById(selection).classList.add('button-selected')
    document.getElementById(selection).classList.remove('button-unselected')

    document.getElementById(languageSelections.find(o => o !== selection)).classList.add('button-unselected')
    document.getElementById(languageSelections.find(o => o !== selection)).classList.remove('button-selected')

    localStorage.setItem('language', selection)
}