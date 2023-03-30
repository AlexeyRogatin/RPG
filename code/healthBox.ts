import { Vector } from "./math";
import { TEXT_KEGEL, drawText, drawRect } from "./drawing";
import { Timer } from "./timers";

const STANDART_HEALTH_BAR_WIDTH = 300;
const STANDART_HEALTH_BAR_HEIGHT = 50;
const STANDART_HEALTH_BAR_TIME = 100;

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
        let progress = 1 - this.timer.getTime() / this.time;
        let hp = Math.max(0, this.startAmount - progress * this.damage);
        let width = hp / this.maxAmount * this.width;
        let diff = this.width - width;
        drawText(this.pos.x, this.pos.y + DMG_OFFSET_Y, String(this.damage), TEXT_KEGEL * 1.5, "Big", true, "red");
        drawRect(this.pos.x, this.pos.y, this.width, STANDART_HEALTH_BAR_HEIGHT, 0, "red");
        drawRect(this.pos.x - diff / 2, this.pos.y, width, STANDART_HEALTH_BAR_HEIGHT, 0, "green");
    }
}