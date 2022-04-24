function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showVR(status = true) {
    if (status) {
        document.getElementById('VRScene').style.display = 'block'
    } else {
        document.getElementById('VRScene').style.display = 'none'
    }
}
function showAR(status = true) {
    if (status) {
        document.getElementById("myAnimation").style.display = 'block'
        document.getElementById('my-canvas').style.display = 'block'
    } else {
        document.getElementById("myAnimation").style.display = 'none'
        document.getElementById('my-canvas').style.display = 'none'
    }
}