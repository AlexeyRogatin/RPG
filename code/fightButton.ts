import { Vector } from "./math";
import { drawImage, drawRect, drawText } from "./drawing";
import { isInRect } from "./math";
import { zKey } from "./input";

export class FightButton {
    pos: Vector = new Vector(0, 0);
    size: Vector = new Vector(0, 0);
    text: string;
    icon: HTMLImageElement;
    pressed = false;
    activated = false;
    constructor(pos: Vector, size: Vector, text: string, icon: HTMLImageElement) {
        this.size = size;
        this.pos = pos;
        this.text = text;
        this.icon = icon;
    }
    draw() {
        let color = "yellow";
        if (!this.pressed) {
            color = "orange";
            drawImage(this.pos.x - this.size.x / 3, this.pos.y, this.size.y * 0.66, this.size.y * 0.66, 0, this.icon);
        }
        drawRect(this.pos.x, this.pos.y, this.size.x, this.size.y, 0, color, 5);
        drawText(this.pos.x + this.size.x / 7, this.pos.y, this.text, Math.round(this.size.y * 0.5), "Big", true, color);
    }
    updateButton() {
        this.pressed = false;
        this.activated = false;
    }
    checkCollision(pos: Vector) {
        if (isInRect(pos, this.pos, this.size)) {
            this.pressed = true;
            if (zKey.wentDown) {
                this.activated = true;
            }
        }
    }
}