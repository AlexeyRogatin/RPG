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
    width: number;
    height: number;
    drawWidth: number;
    drawHeight: number;
    constructor(src: string, invertedX = false, invertedY = false) {
        this.img = loadImageFromData(src);
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
        let img = imgNone;
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

export let imgNone = new Img("none.bmp");

export let imgHeart = new Img("heart.bmp");
export let imgFight = new Img("fightIcon.bmp");
export let imgAct = new Img("actIcon.bmp");
export let imgItem = new Img("itemIcon.bmp");
export let imgMercy = new Img("mercyIcon.bmp");
export let imgDialogueBox = new Img("dialogueBox.bmp");
export let imgDialogueBoxCorner = new Img("dialogueBoxCorner.bmp");
export let imgDialogueBoxTail = new Img("dialogueBoxTail.bmp");

export let imgInvisibleManBoots = new Img("invisibleManBoots.bmp");
export let imgInvisibleManTrench = new Img("invisibleManCoat.bmp");
export let imgInvisibleManHead = new Img("invisibleManHead.bmp");
export let imgInvisibleManDefeat = new Img("invisibleManDefeat.bmp");

export let animHit = new AnimatedImg(false, false, "hit1.bmp", "hit2.bmp", "hit3.bmp",
    "hit4.bmp", "hit5.bmp", "hit6.bmp", "hit7.bmp");

export let imgLexa = new Img("lexaIdle.bmp");
export let imgLexaBack = new Img("lexaBack.bmp");
export let imgLexaSideRight = new Img("lexaSide.bmp");
export let imgLexaSideLeft = new Img("lexaSide.bmp", true);

export let animLexaWalk = new AnimatedImg(false, false, "lexaWalk1.bmp", "lexaIdle.bmp", "lexaWalk2.bmp", "lexaIdle.bmp");
export let animLexaWalkBack = new AnimatedImg(false, false, "lexaBackWalk1.bmp", "lexaBack.bmp", "lexaBackWalk2.bmp", "lexaBack.bmp");;
export let animLexaWalkSideRight = new AnimatedImg(false, false, "lexaSideWalk1.bmp", "lexaSide.bmp", "lexaSideWalk2.bmp", "lexaSide.bmp");
export let animLexaWalkSideLeft = new AnimatedImg(true, false, "lexaSideWalk1.bmp", "lexaSide.bmp", "lexaSideWalk2.bmp", "lexaSide.bmp");