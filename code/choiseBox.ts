import { Vector, clamp } from "./math";
import { drawText, TEXT_KEGEL } from "./drawing";
import { TRANSPARENCY } from "./drawing";
import { rightKey, leftKey, downKey, upKey, zKey } from "./input";

export const CHOICE_RESULT_NONE = -1;

export class Option {
    public choice: string;
    public color: string;
    public available: boolean;
    constructor(choice: string, color: string, available: boolean) {
        this.choice = choice;
        this.color = color;
        this.available = available;
    }
}

export class ChoiseBox {
    pos: Vector;
    options: Option[] = [];
    size: Vector;
    currentChoise = 0;
    result = CHOICE_RESULT_NONE;
    constructor(pos: Vector, size: Vector) {
        this.pos = pos;
        this.size = size;
    }

    clear() {
        this.options = [];
        this.currentChoise = 0;
        this.result = CHOICE_RESULT_NONE;
    }

    updateChoise(heartPos: Vector) {
        this.currentChoise += Number(rightKey.wentDown) - Number(leftKey.wentDown);
        this.currentChoise += 2 * (Number(downKey.wentDown) - Number(upKey.wentDown));
        this.currentChoise = clamp(this.currentChoise, 0, this.options.length - 1);
        if (zKey.wentDown && this.options[this.currentChoise].available) {
            heartPos = new Vector(1000, 1000);
            this.result = this.currentChoise;
            zKey.wentDown = false;
        } else {
            heartPos = this.getHeartPos();
        }
        return heartPos;
    }

    draw() {
        let offsetX = this.size.x;
        let rowsCount = Math.ceil(this.options.length / 2);
        let offsetY = rowsCount === 1 ? 1 : this.size.y / (rowsCount - 1);
        for (let choiceIndex = 0; choiceIndex < this.options.length; choiceIndex++) {
            let x = this.pos.x - this.size.x / 2;
            let y = this.pos.y;
            y -= rowsCount === 1 ? 0 : this.size.y / 2;
            x += offsetX * (choiceIndex % 2);
            y += offsetY * Math.floor(choiceIndex / 2);
            let align = choiceIndex % 2 === 0 ? "left" : "right";
            x += choiceIndex % 2 === 0 ? 25 : -25;
            let alpha = 1;
            if (!this.options[choiceIndex].available) {
                alpha = TRANSPARENCY;
            }
            drawText(x, y, this.options[choiceIndex].choice, TEXT_KEGEL, "Big", false, this.options[choiceIndex].color,
                <CanvasTextAlign>align, undefined, alpha);
        }
    }

    getHeartPos() {
        let offsetX = this.size.x;
        let rowsCount = Math.ceil(this.options.length / 2);
        let offsetY = rowsCount === 1 ? 1 : this.size.y / (rowsCount - 1);

        let x = this.pos.x - this.size.x / 2;
        let y = this.pos.y;
        y -= rowsCount === 1 ? 0 : this.size.y / 2;
        x += offsetX * (this.currentChoise % 2);
        y += offsetY * Math.floor(this.currentChoise / 2);
        return new Vector(x, y);
    }
}