import { TEXT_KEGEL } from "./drawing";
import { Vector, clamp } from "./math";
import { drawParagraph } from "./drawing";
import { PARAGRAPH_SYM } from "./enemies";
import { xKey, zKey } from "./input";
import { Timer } from "./timers";

const CHAR_PAUSE = 2;
const WORD_PAUSE = 3;
const PARAGRAPH_PAUSE = 15;

export class TextBox {
    charTimer = new Timer(0);
    kegel: number;
    color: string;
    pos: Vector = new Vector(0, 0);
    size: Vector = new Vector(0, 0);
    charIndex: number = 0;
    partText: string = "";
    texts: string[] = [];
    partIndex: number = 0;
    partCount: number = 0;
    read: boolean = false;

    constructor(kegel = TEXT_KEGEL, color = "white") {
        this.kegel = kegel;
        this.color = color;
    }

    setPos(pos: Vector, size: Vector) {
        this.pos = pos;
        this.size = size;
    }

    newText(text: string) {
        this.charIndex = 0;
        this.partText = "";
        this.texts = text.split(PARAGRAPH_SYM);
        this.partIndex = 0;
        this.partCount = (text.split(PARAGRAPH_SYM)).length;
        this.read = false;
    }

    updateText() {
        if (xKey.wentDown) {
            this.charIndex = this.texts[this.partIndex].length;
            this.partText = this.texts[this.partIndex];
        }
        if (this.charIndex === this.texts[this.partIndex].length) {
            if (zKey.wentDown) {
                if (this.partIndex + 1 === this.partCount) {
                    this.read = true;
                } else {
                    this.partText = "";
                    this.charIndex = 0;
                    this.partIndex = clamp(this.partIndex + 1, 0, this.partCount - 1);
                }
            }
        } else if (this.charTimer.getTime() <= 0) {
            this.partText += this.texts[this.partIndex][this.charIndex];
            this.charIndex++;
            let time = CHAR_PAUSE;
            switch (this.texts[this.partIndex][this.charIndex]) {
                case ' ': {
                    time = WORD_PAUSE;
                } break;
                case '\n': {
                    time = PARAGRAPH_PAUSE;
                } break;
            }
            this.charTimer.setTime(time);
        }
    }

    draw() {
        drawParagraph(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2,
            this.partText, this.kegel, "Big", false, this.color, this.size.x, this.kegel * 1.5);
    }
}