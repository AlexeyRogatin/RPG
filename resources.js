function loadImage(src) {
    let img = new Image();
    img.src = src;
    return img;
}

function loadImageFromData(src) {
    src = "./data/" + src;
    return loadImage(src);
}

class AnimatedImage {
    constructor() {
        this.images = [];
        for (let imageIndex = 0; imageIndex < arguments.length; imageIndex++) {
            this.images.push(loadImageFromData(arguments[imageIndex]));
        }
        this.changeTimer = getTimer(0);
        this.playing = false;
    }
    startAnimation(delay, looped) {
        setTimer(this.changeTimer, delay * this.images.length - 1);
        this.delay = delay;
        this.looped = looped;
        this.playing = true;
    }
    getImage() {
        if (getTime(this.changeTimer) < 0) {
            if (this.looped) {
                setTime(this.changeTimer, this.delay * this.images.length - 1);
            } else {
                this.playing = false;
            }
        }
        if (this.playing) {
            return this.images[this.images.length - 1 - Math.floor(getTime(this.changeTimer) / this.delay)];
        } else {
            return imgNone;
        }
    }
}

let imgNone = loadImageFromData("none.bmp");

let imgHeart = loadImageFromData("heart.bmp");
let imgFight = loadImageFromData("fightIcon.bmp");
let imgAct = loadImageFromData("actIcon.bmp");
let imgItem = loadImageFromData("itemIcon.bmp");
let imgMercy = loadImageFromData("mercyIcon.bmp");
let imgDialogueBox = loadImageFromData("dialogueBox.bmp");

let imgInvisibleManBoots = loadImageFromData("invisibleManBoots.bmp");
let imgInvisibleManTrench = loadImageFromData("invisibleManCoat.bmp");
let imgInvisibleManHead = loadImageFromData("invisibleManHead.bmp");

let animHit = new AnimatedImage("hit1.bmp", "hit2.bmp", "hit3.bmp", "hit4.bmp", "hit5.bmp", "hit6.bmp", "hit7.bmp");