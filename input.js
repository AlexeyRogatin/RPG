let keys = []

function addKey(code) {
    keys[keys.length] = {
        isDown: false,
        wentDown: false,
        wentUp: false,
        keyCode: code
    }
    return keys.length - 1;
}

let upKey = addKey(38);
let downKey = addKey(40);
let leftKey = addKey(37);
let rightKey = addKey(39);
let zKey = addKey(90);
let xKey = addKey(88);

function handleKeyDown(key) {
    if (!key.isDown) {
        key.wentDown = true;
        key.isDown = true;
    }
}

function handleKeyUp(key) {
    if (key.isDown) {
        key.wentUp = true;
        key.isDown = false;
    }
}

window.onkeydown = function onkeydown(event) {
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        if (event.keyCode === keys[keyIndex].keyCode) {
            handleKeyDown(keys[keyIndex]);
        }
    }
}

let locked = false;

document.addEventListener("pointerlockchange", function lockChange() {
    locked = !locked;
}, false)

document.addEventListener("mousedown", function mouseDown(event) {
    if (!locked) {
        canvas.requestFullscreen();
        canvas.requestPointerLock();
    }
})

window.onkeyup = function onkeyup(event) {
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        if (event.keyCode === keys[keyIndex].keyCode) {
            handleKeyUp(keys[keyIndex]);
        }
    }
}

function clearKey(key) {
    key.wentDown = false;
    key.wentUp = false;
}

function clearKeys() {
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        clearKey(keys[keyIndex]);
    }
}