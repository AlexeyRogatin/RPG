import { Vector } from "./math";
import { TEXT_KEGEL, drawText, drawRect } from "./drawing";
import { Timer } from "./timers";

const STANDART_HEALTH_BAR_WIDTH = 300;
const STANDART_HEALTH_BAR_HEIGHT = 50;
const STANDART_HEALTH_BAR_TIME = 100;
const STANDART_HEALTH_BAR_DEPLETION_TIME = 0.7;

const DMG_OFFSET_Y = -50;

export class HealthBox {
    timer = new Timer(0);
    ended = true;
    pos = new Vector(0, 0);
    startAmount = 0;
    damage = 0;
    maxAmount = 0;
    width = 0;
    time = 0;

    playAnimation(pos: Vector, startAmount: number, damage: number, maxAmount: number,
        time = STANDART_HEALTH_BAR_TIME, width = STANDART_HEALTH_BAR_WIDTH) {
        this.pos = pos
        this.startAmount = startAmount;
        this.damage = damage;
        this.maxAmount = maxAmount;
        this.width = width;
        this.ended = false;
        this.time = time;
        this.timer.setTime(time);
    }
    update() {
        if (this.timer.getTime() < 0) {
            this.ended = true;
        }
    }
    draw() {
        let progress = this.timer.getTime() / this.time;
        progress -= 1 - STANDART_HEALTH_BAR_DEPLETION_TIME;
        progress /= STANDART_HEALTH_BAR_DEPLETION_TIME;
        progress = Math.max(0, progress);
        let hp = Math.max(0, this.startAmount + (progress - 1) * this.damage);
        let width = hp / this.maxAmount * this.width;
        let diff = this.width - width;
        drawText(this.pos.x, this.pos.y + DMG_OFFSET_Y, String(this.damage), TEXT_KEGEL * 2, "Big", true, "red");
        drawText(this.pos.x, this.pos.y + DMG_OFFSET_Y, String(this.damage), TEXT_KEGEL * 2, "Big", true, "darkred",
            undefined, undefined, undefined, 1);
        drawRect(this.pos.x, this.pos.y, this.width, STANDART_HEALTH_BAR_HEIGHT, 0, "red");
        drawRect(this.pos.x - diff / 2, this.pos.y, width, STANDART_HEALTH_BAR_HEIGHT, 0, "green");
        drawRect(this.pos.x, this.pos.y, this.width, STANDART_HEALTH_BAR_HEIGHT, 0, "darkred", 4);
    }
}