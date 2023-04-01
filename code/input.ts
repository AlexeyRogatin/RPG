import { camera, canvas } from "./drawing";
import { Vector } from "./math";

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

class Mouse {
    pos: Vector = new Vector(0, 0);
    worldPos: Vector = new Vector(0, 0);
    isDown = false;
    wentDown = false;
    wentUp = false;
}

enum keyCodes {
    UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39,
    Z = 90,
    X = 88,
    ENTER = 13,

    N = 78,
    C = 67,
    L = 76,
    I = 73,
    E = 69,
    D = 68,
}

export let upKey = new Key(keyCodes.UP);
export let downKey = new Key(keyCodes.DOWN);
export let leftKey = new Key(keyCodes.LEFT);
export let rightKey = new Key(keyCodes.RIGHT);
export let zKey = new Key(keyCodes.Z);
export let xKey = new Key(keyCodes.X);
export let enterKey = new Key(keyCodes.ENTER);

export let nKey = new Key(keyCodes.N);
export let cKey = new Key(keyCodes.C);
export let lKey = new Key(keyCodes.L);
export let iKey = new Key(keyCodes.I);
export let eKey = new Key(keyCodes.E);
export let dKey = new Key(keyCodes.D);

export let mouse = new Mouse();

function handleKeyDown(key: Key | Mouse) {
    if (!key.isDown) {
        key.wentDown = true;
        key.isDown = true;
    }
}

function handleKeyUp(key: Key | Mouse) {
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

window.onmousedown = function onmousedown(event) {
    handleKeyDown(mouse);
}

window.onmouseup = function onmouseup(event) {
    handleKeyUp(mouse);
}

window.onmousemove = function onmousemove(event) {
    let rect = canvas.getBoundingClientRect();
    mouse.pos.x = event.clientX;
    mouse.pos.y = event.clientY;
    mouse.worldPos.x = (event.clientX * canvas.width / rect.width - canvas.width / 2 + camera.pos.x - rect.left);
    mouse.worldPos.y = (event.clientY * canvas.height / rect.height - canvas.height / 2 + camera.pos.y - rect.top);
}

function clearKey(key: Key | Mouse) {
    key.wentDown = false;
    key.wentUp = false;
}

export function clearKeys() {
    for (let keyIndex = 0; keyIndex < Key.keys.length; keyIndex++) {
        clearKey(Key.keys[keyIndex]);
    }
    clearKey(mouse);
}

document.addEventListener("mousedown", function mouseDown(event) {
    canvas.requestFullscreen();
    // canvas.requestPointerLock();
})