const MIN_SPEED = 0.01;
const MAX_SPEED = 0.017;
const HIT_WIDTH = 0.05;
const HIT_MIN = 0.5;
const HIT_MAX = 1 - HIT_WIDTH / 2;

const HIT_VALUE_MISS = -1;

const ENDED_VALUE_HIT = -1;

const GREAT_HIT_MULTIPLIER = 2;

class hitBox {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
        this.clear();
        this.ended = true;
    }

    clear() {
        this.ended = false;
        this.indicator = 0;
        this.speed = getRandomFloat(MIN_SPEED, MAX_SPEED) * this.size.x;
        this.value = 0;
        this.hitPos = getRandomFloat(HIT_MIN, HIT_MAX) * this.size.x;
        this.ended = false;
    }

    updateIndicator() {
        if (this.ended === ENDED_VALUE_HIT) {
            this.ended = true;
        }
        if (!this.ended) {
            this.indicator += this.speed;
            if (keys[zKey].wentDown) {
                if (this.indicator < this.hitPos) {
                    this.value = this.indicator / this.hitPos;
                } else {
                    this.value = (this.size.x - this.indicator) / (this.size.x - this.hitPos);
                }
                let hitWidth = HIT_WIDTH * this.size.x;
                if (this.indicator >= this.hitPos - hitWidth / 2 &&
                    this.indicator <= this.hitPos + hitWidth / 2) {
                    this.value *= GREAT_HIT_MULTIPLIER;
                }
                this.ended = ENDED_VALUE_HIT;
            }
            if (this.indicator > this.size.x) {
                this.indicator = this.size.x;
                this.ended = true;
                this.value = HIT_VALUE_MISS;
            }
        }
    }

    draw() {
        let hitWidth = HIT_WIDTH * this.size.x;
        drawRect(this.pos.x - this.size.x / 2 + this.hitPos, this.pos.y, hitWidth, this.size.y, 0, "green", 10);
        drawPolygon(this.pos.x - this.size.x / 2 + this.indicator, this.pos.y, "white", [{ x: 0, y: -this.size.y / 2 }, { x: 0, y: this.size.y / 2 }], 7);
    }
}