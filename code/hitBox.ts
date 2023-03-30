import { Vector, getRandomFloat } from "./math";
import { drawRect, drawPolygon } from "./drawing";
import { zKey } from "./input";

const MIN_SPEED = 0.01;
const MAX_SPEED = 0.017;
const HIT_WIDTH = 0.05;
const HIT_MIN = 0.5;
const HIT_MAX = 1 - HIT_WIDTH / 2;

const HIT_VALUE_MISS = -1;

export enum HitState {
    LAND_HIT = -1,
    ENDED = 0,
    PLAYING = 1,
}


const GREAT_HIT_MULTIPLIER = 2;

export class HitBox {
    pos = new Vector(0, 0);
    size = new Vector(0, 0);
    state = HitState.ENDED;
    indicator = 0;
    speed = 0;
    value = 0;
    hitPos = 0;

    constructor(pos: Vector, size: Vector) {
        this.pos = pos;
        this.size = size;
        this.clear();
    }

    clear() {
        this.state = HitState.PLAYING;
        this.indicator = 0;
        this.speed = getRandomFloat(MIN_SPEED, MAX_SPEED) * this.size.x;
        this.value = 0;
        this.hitPos = getRandomFloat(HIT_MIN, HIT_MAX) * this.size.x;
    }

    updateIndicator() {
        if (this.state === HitState.LAND_HIT) {
            this.state = HitState.ENDED;
        }
        if (this.state === HitState.PLAYING) {
            this.indicator += this.speed;
            if (zKey.wentDown) {
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
                this.state = HitState.LAND_HIT;
            }
            if (this.indicator > this.size.x) {
                this.indicator = this.size.x;
                this.state = HitState.ENDED;
                this.value = HIT_VALUE_MISS;
            }
        }
    }

    draw() {
        let hitWidth = HIT_WIDTH * this.size.x;
        drawRect(this.pos.x - this.size.x / 2 + this.hitPos, this.pos.y, hitWidth, this.size.y, 0, "green", 10);
        drawPolygon(this.pos.x - this.size.x / 2 + this.indicator, this.pos.y, "white",
            [new Vector(0, -this.size.y / 2), new Vector(0, this.size.y / 2)], 7);
    }
}