import { canvas } from "./drawing";

class Key {
    static keys: Key[] = [];

    isDown = false;
    wentDown = false;
    wentUp = false;
    keyCode: number;

    constructor(keyCode: number) {
        this.keyCode = keyCode;
        Key.keys.push(this);
    }
}

enum keyCodes {
    UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39,
    Z = 90,
    X = 88,
}

//TODO: подозрительные клавиши
export let upKey = new Key(keyCodes.UP);
export let downKey = new Key(keyCodes.DOWN);
export let leftKey = new Key(keyCodes.LEFT);
export let rightKey = new Key(keyCodes.RIGHT);
export let zKey = new Key(keyCodes.Z);
export let xKey = new Key(keyCodes.X);

function handleKeyDown(key: Key) {
    if (!key.isDown) {
        key.wentDown = true;
        key.isDown = true;
    }
}

function handleKeyUp(key: Key) {
    if (key.isDown) {
        key.wentUp = true;
        key.isDown = false;
    }
}

window.onkeydown = function onkeydown(event) {
    for (let keyIndex = 0; keyIndex < Key.keys.length; keyIndex++) {
        if (event.keyCode === Key.keys[keyIndex].keyCode) {
            handleKeyDown(Key.keys[keyIndex]);
        }
    }
}

window.onkeyup = function onkeyup(event) {
    for (let keyIndex = 0; keyIndex < Key.keys.length; keyIndex++) {
        if (event.keyCode === Key.keys[keyIndex].keyCode) {
            handleKeyUp(Key.keys[keyIndex]);
        }
    }
}

function clearKey(key: Key) {
    key.wentDown = false;
    key.wentUp = false;
}

export function clearKeys() {
    for (let keyIndex = 0; keyIndex < Key.keys.length; keyIndex++) {
        clearKey(Key.keys[keyIndex]);
    }
}

document.addEventListener("mousedown", function mouseDown(event) {
    canvas.requestFullscreen();
    canvas.requestPointerLock();
})