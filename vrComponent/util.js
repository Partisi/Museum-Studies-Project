
// Simple Sleeper function to wait for execution
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Show OR Hide VR Container
function showVR(status = true) {
    if (status) {
        document.getElementById('VRScene').style.display = 'block'
    } else {
        document.getElementById('VRScene').style.display = 'none'
    }
}

// Show OR Hide AR Container
function showAR(status = true) {
    if (status) {
        document.getElementById("myAnimation").style.display = 'block'
        document.getElementById('my-canvas').style.display = 'block'
    } else {
        document.getElementById("myAnimation").style.display = 'none'
        document.getElementById('my-canvas').style.display = 'none'
    }
}