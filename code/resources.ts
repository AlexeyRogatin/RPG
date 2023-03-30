import { Timer } from "./timers";

function loadImage(src: string) {
    let img = new Image();
    img.src = src;
    return img;
}

function loadImageFromData(src: string) {
    src = "../data/" + src;
    return loadImage(src);
}

export class AnimatedImage {
    images: HTMLImageElement[] = [];
    changeTimer = new Timer(0);
    playing = false;

    delay: number = 0;
    looped: boolean = false;

    constructor(...args: any[]) {
        for (let imageIndex = 0; imageIndex < arguments.length; imageIndex++) {
            this.images.push(loadImageFromData(arguments[imageIndex]));
        }
    }

    startAnimation(delay: number, looped: boolean) {
        this.changeTimer.setTime(delay * this.images.length - 1);

        this.delay = delay;
        this.looped = looped;
        this.playing = true;
    }

    getImage() {
        if (this.changeTimer.getTime() < 0) {
            if (this.looped) {
                this.changeTimer.setTime(this.delay * this.images.length - 1);
            } else {
                this.playing = false;
            }
        }
        if (this.playing) {
            return this.images[this.images.length - 1 - Math.floor(this.changeTimer.getTime() / this.delay)];
        } else {
            return imgNone;
        }
    }
}

//TODO: подозрительные переменные

export let imgNone = loadImageFromData("none.bmp");

export let imgHeart = loadImageFromData("heart.bmp");
export let imgFight = loadImageFromData("fightIcon.bmp");
export let imgAct = loadImageFromData("actIcon.bmp");
export let imgItem = loadImageFromData("itemIcon.bmp");
export let imgMercy = loadImageFromData("mercyIcon.bmp");
export let imgDialogueBox = loadImageFromData("dialogueBox.bmp");
export let imgDialogueBoxCorner = loadImageFromData("dialogueBoxCorner.bmp");
export let imgDialogueBoxTail = loadImageFromData("dialogueBoxTail.bmp");

export let imgInvisibleManBoots = loadImageFromData("invisibleManBoots.bmp");
export let imgInvisibleManTrench = loadImageFromData("invisibleManCoat.bmp");
export let imgInvisibleManHead = loadImageFromData("invisibleManHead.bmp");
export let imgInvisibleManDefeat = loadImageFromData("invisibleManDefeat.bmp");

export let animHit = new AnimatedImage("hit1.bmp", "hit2.bmp", "hit3.bmp", "hit4.bmp", "hit5.bmp", "hit6.bmp", "hit7.bmp");