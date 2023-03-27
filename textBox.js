const CHAR_PAUSE = 2;
const WORD_PAUSE = 3;
const PARAGRAPH_PAUSE = 15;

class TextBox {
    constructor(pos, text, size, kegel = TEXT_KEGEL, color = "white") {
        this.pos = pos;
        this.texts = text.split(PARAGRAPH_SYM);
        this.charTimer = getTimer(0);
        this.partIndex = 0;
        this.partCount = this.texts.length;
        this.kegel = kegel;
        this.color = color;
        this.read = false;
        this.size = size;
    }

    newText(text) {
        this.charIndex = 0;
        this.partText = "";
        this.texts = text.split(PARAGRAPH_SYM);
        this.partIndex = 0;
        this.partCount = (text.split(PARAGRAPH_SYM)).length;
        keys[zKey].wentDown = false;
        this.read = false;
    }

    updateText() {
        if (keys[xKey].wentDown) {
            this.charIndex = this.texts[this.partIndex].length;
            this.partText = this.texts[this.partIndex];
        }
        if (this.charIndex === this.texts[this.partIndex].length) {
            if (keys[zKey].wentDown) {
                if (this.partIndex + 1 === this.partCount) {
                    this.read = true;
                }
                this.partText = "";
                this.charIndex = 0;
                this.partIndex = clamp(this.partIndex + 1, 0, this.partCount - 1);
            }
        } else if (getTime(this.charTimer) <= 0) {
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
            setTimer(this.charTimer, time);
        }
    }

    draw() {
        drawParagraph(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2,
            this.partText, this.kegel, "Big", false, this.color, this.size.x, this.kegel * 1.5);
    }
}