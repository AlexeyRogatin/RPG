import { Timer } from "./timers";
import { Vector } from "./math";

function loadImage(src: string) {
    let img = new Image();
    img.src = src;
    return img;
}

function loadImageFromData(src: string, inverted = new Vector(0, 0)) {
    src = "../data/" + src;
    let img = loadImage(src);
    return img;
}

export class Img {
    img: HTMLImageElement;
    width: number = 0;
    height: number = 0;
    drawWidth: number = 0;
    drawHeight: number = 0;
    constructor(src: string, invertedX = false, invertedY = false) {
        this.img = loadImageFromData(src);
        this.img.onload = () => {
            this.width = this.img.width;
            this.height = this.img.height;
            this.drawWidth = this.img.width;
            this.drawHeight = this.img.height;
            if (invertedX) {
                this.drawWidth *= -1;
            }
            if (invertedY) {
                this.drawHeight *= -1;
            }
        }
    }
    updateImage() {
    }
}

export class AnimatedImg extends Img {
    images: Img[] = [];
    changeTimer = new Timer(0);
    playing = false;

    delay: number = 0;
    looped: boolean = false;

    constructor(invertedX = false, invertedY = false, ...args: any[]) {
        super("none.bmp", invertedX, invertedY);
        for (let imageIndex = 2; imageIndex < arguments.length; imageIndex++) {
            this.images.push(new Img(arguments[imageIndex], invertedX, invertedY));
        }
    }

    startAnimation(delay: number, looped: boolean) {
        this.changeTimer.setTime(delay * this.images.length - 1);

        this.delay = delay;
        this.looped = looped;
        this.playing = true;
    }

    changeDelay(delay: number) {
        let progress = Math.floor(this.changeTimer.getTime() / this.delay * delay);
        this.changeTimer.setTime(progress);
        this.delay = delay;
    }

    updateImage() {
        if (this.changeTimer.getTime() < 0) {
            if (this.looped) {
                this.changeTimer.setTime(this.delay * this.images.length - 1);
            } else {
                this.playing = false;
            }
        }
        let img = images["none.bmp"];
        if (this.playing) {
            img = this.images[this.images.length - 1 - Math.floor(this.changeTimer.getTime() / this.delay)]

        }
        this.img = img.img;
        this.width = img.width;
        this.height = img.height;
        this.drawWidth = img.drawWidth;
        this.drawHeight = img.drawHeight;
    }
}

export function getImage(key: string) {
    let image = images[key];
    if (image === undefined) {
        image = images["none.bmp"];
    }
    return image;
}

export function getAnimation(key: string) {
    let image = images[key];
    if (image === undefined) {
        image = images["none.bmp"];
    }
    return <AnimatedImg>image;
}

let images: Record<string, Img | AnimatedImg> = {
    "none.bmp": new Img("none.bmp"),

    "heart.bmp": new Img("heart.bmp"),
    "fightIcon.bmp": new Img("fightIcon.bmp"),
    "actIcon.bmp": new Img("actIcon.bmp"),
    "itemIcon.bmp": new Img("itemIcon.bmp"),
    "mercyIcon.bmp": new Img("mercyIcon.bmp"),
    "dialogueBox.bmp": new Img("dialogueBox.bmp"),
    "dialogueBoxCorner.bmp": new Img("dialogueBoxCorner.bmp"),
    "dialogueBoxTail.bmp": new Img("dialogueBoxTail.bmp"),

    "invisibleManBoots.bmp": new Img("invisibleManBoots.bmp"),
    "invisibleManCoat.bmp": new Img("invisibleManCoat.bmp"),
    "invisibleManHead.bmp": new Img("invisibleManHead.bmp"),
    "invisibleManDefeat.bmp": new Img("invisibleManDefeat.bmp"),

    "hit.bmp": new AnimatedImg(false, false, "hit1.bmp", "hit2.bmp", "hit3.bmp",
        "hit4.bmp", "hit5.bmp", "hit6.bmp", "hit7.bmp"),

    "lexaIdle.bmp": new Img("lexaIdle.bmp"),
    "lexaBack.bmp": new Img("lexaBack.bmp"),
    "lexaRight.bmp": new Img("lexaSide.bmp"),
    "lexaLeft.bmp": new Img("lexaSide.bmp", true),

    "wood.bmp": new Img("wood.bmp"),
    "wall.bmp": new Img("wall.bmp"),

    "lexaWalk.bmp": new AnimatedImg(false, false, "lexaWalk1.bmp", "lexaIdle.bmp", "lexaWalk2.bmp", "lexaIdle.bmp"),
    "lexaBackWalk.bmp": new AnimatedImg(false, false, "lexaBackWalk1.bmp", "lexaBack.bmp", "lexaBackWalk2.bmp", "lexaBack.bmp"),
    "lexaRightWalk.bmp": new AnimatedImg(false, false, "lexaSideWalk1.bmp", "lexaSide.bmp", "lexaSideWalk2.bmp", "lexaSide.bmp"),
    "lexaLeftWalk.bmp": new AnimatedImg(true, false, "lexaSideWalk1.bmp", "lexaSide.bmp", "lexaSideWalk2.bmp", "lexaSide.bmp"),
}