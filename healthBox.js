STANDART_HEALTH_BAR_WIDTH = 300;
STANDART_HEALTH_BAR_HEIGHT = 50;
STANDART_HEALTH_BAR_TIME = 100;

const DMG_OFFSET_Y = -50;

class HealthBox {
    constructor() {
        this.timer = getTimer();
        this.ended = true;
    }
    playAnimation(pos, startAmount, damage, maxAmount, time = STANDART_HEALTH_BAR_TIME, width = STANDART_HEALTH_BAR_WIDTH) {
        this.pos = pos
        this.startAmount = startAmount;
        this.damage = damage;
        this.maxAmount = maxAmount;
        this.width = width;
        this.ended = false;
        this.time = time;
        setTimer(this.timer, time);
    }
    update() {
        if (getTime(this.timer) < 0) {
            this.ended = true;
        }
    }
    draw() {
        let progress = 1 - getTime(this.timer) / this.time;
        let hp = Math.max(0, this.startAmount - progress * this.damage);
        let width = hp / this.maxAmount * this.width;
        let diff = this.width - width;
        drawText(this.pos.x, this.pos.y + DMG_OFFSET_Y, this.damage, TEXT_KEGEL * 1.5, "Big", true, "red");
        drawRect(this.pos.x, this.pos.y, this.width, STANDART_HEALTH_BAR_HEIGHT, 0, "red");
        drawRect(this.pos.x - diff / 2, this.pos.y, width, STANDART_HEALTH_BAR_HEIGHT, 0, "green");
    }
}