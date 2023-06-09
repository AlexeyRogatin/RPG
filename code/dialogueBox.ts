import { imgDialogueBoxCorner, imgDialogueBoxTail } from "resources";
import { drawImage, drawRect, FIGHT_IMAGE_SCALING } from "drawing";
import { TextBox } from "textBox";
import { Vector } from "./math";

const DIALOGUE_BOX_KEGEL = 28;
const DIALOGUE_FONT_COLOR = "black";
const DIALOGUE_BOX_COLOR = "white";
const DIALOGUE_BOX_BORDER = imgDialogueBoxCorner.width * FIGHT_IMAGE_SCALING;
const DIALOGUE_BOX_TAIL = imgDialogueBoxTail.width * FIGHT_IMAGE_SCALING;

export class DialogueBox {
    textBox = new TextBox(DIALOGUE_BOX_KEGEL, DIALOGUE_FONT_COLOR);

    drawDialogueRect() {
        drawImage(this.textBox.pos.x - (this.textBox.size.x + DIALOGUE_BOX_BORDER) / 2,
            this.textBox.pos.y - (this.textBox.size.y + DIALOGUE_BOX_BORDER) / 2,
            DIALOGUE_BOX_BORDER + 4, DIALOGUE_BOX_BORDER + 4, 0, imgDialogueBoxCorner);
        drawImage(this.textBox.pos.x - (this.textBox.size.x + DIALOGUE_BOX_BORDER) / 2,
            this.textBox.pos.y + (this.textBox.size.y + DIALOGUE_BOX_BORDER) / 2,
            DIALOGUE_BOX_BORDER + 4, DIALOGUE_BOX_BORDER + 4, Math.PI / 2, imgDialogueBoxCorner);
        drawImage(this.textBox.pos.x + (this.textBox.size.x + DIALOGUE_BOX_BORDER) / 2,
            this.textBox.pos.y + (this.textBox.size.y + DIALOGUE_BOX_BORDER) / 2,
            DIALOGUE_BOX_BORDER + 4, DIALOGUE_BOX_BORDER + 4, Math.PI, imgDialogueBoxCorner);
        drawImage(this.textBox.pos.x + (this.textBox.size.x + DIALOGUE_BOX_BORDER) / 2,
            this.textBox.pos.y - (this.textBox.size.y + DIALOGUE_BOX_BORDER) / 2,
            DIALOGUE_BOX_BORDER + 4, DIALOGUE_BOX_BORDER + 4, Math.PI * 3 / 2, imgDialogueBoxCorner);
        drawImage(this.textBox.pos.x - (this.textBox.size.x + DIALOGUE_BOX_TAIL) / 2 - DIALOGUE_BOX_BORDER,
            this.textBox.pos.y - (this.textBox.size.y - DIALOGUE_BOX_TAIL) / 2,
            DIALOGUE_BOX_BORDER + 4, DIALOGUE_BOX_BORDER + 4, 0, imgDialogueBoxTail);
        drawRect(this.textBox.pos.x, this.textBox.pos.y,
            this.textBox.size.x + 4, this.textBox.size.y + DIALOGUE_BOX_BORDER * 2 + 4, 0, DIALOGUE_BOX_COLOR);
        drawRect(this.textBox.pos.x, this.textBox.pos.y,
            this.textBox.size.x + DIALOGUE_BOX_BORDER * 2 + 4, this.textBox.size.y + 4, 0, DIALOGUE_BOX_COLOR);
    }

    setPos(pos: Vector, size: Vector) {
        this.textBox.setPos(pos, size);
    }

    newText(text: string) {
        this.textBox.newText(text);
    }

    draw() {
        this.textBox.updateText();
        this.drawDialogueRect();
        this.textBox.draw();
    }

    read() {
        return this.textBox.read;
    }
}