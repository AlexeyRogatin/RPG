const RESULT_NONE = -1;
const TEXT_KEGEL = 32;

class ChoiseBox {
    constructor(pos, choises, size) {
        this.pos = pos;
        this.choises = choises;
        this.size = size;
        this.currentChoise = 0;
        this.result = RESULT_NONE;
    }

    updateChoise(heart) {
        this.currentChoise += keys[rightKey].wentDown - keys[leftKey].wentDown;
        this.currentChoise += 2 * (keys[downKey].wentDown - keys[upKey].wentDown);
        this.currentChoise = clamp(this.currentChoise, 0, this.choises.length - 1);
        if (keys[zKey].wentDown && this.availability[this.currentChoise]) {
            this.result = this.currentChoise;
            heart.pos = new Vector(-1000, -1000);
            keys[zKey].wentDown = false;
        } else {
            heart.pos = this.getHeartPos();
        }
    }

    clear() {
        this.currentChoise = 0;
        this.result = RESULT_NONE;
        this.choises = [];
        this.colors = [];
        this.availability = [];
    }

    draw() {
        let offsetX = this.size.x;
        let rowsCount = Math.ceil(this.choises.length / 2);
        let offsetY = rowsCount === 1 ? 1 : this.size.y / (rowsCount - 1);
        for (let choiseIndex = 0; choiseIndex < this.choises.length; choiseIndex++) {
            let x = this.pos.x - this.size.x / 2;
            let y = this.pos.y;
            y -= rowsCount === 1 ? 0 : this.size.y / 2;
            x += offsetX * (choiseIndex % 2);
            y += offsetY * Math.floor(choiseIndex / 2);
            let align = choiseIndex % 2 === 0 ? "left" : "right";
            if (choiseIndex === this.currentChoise) {
                drawImage(x, y, HEART_SIZE.x, HEART_SIZE.y, 0, imgHeart);
            }
            x += choiseIndex % 2 === 0 ? 25 : -25;
            if (!this.availability[choiseIndex]) {
                ctx.globalAlpha = TRANSPARENCY;
            }
            drawText(x, y, this.choises[choiseIndex], TEXT_KEGEL, "Big", false, this.colors[choiseIndex], align);
            ctx.globalAlpha = 1;
        }
    }

    getHeartPos() {
        let offsetX = this.size.x;
        let rowsCount = Math.ceil(this.choises.length / 2);
        let offsetY = rowsCount === 1 ? 1 : this.size.y / (rowsCount - 1);

        let x = this.pos.x - this.size.x / 2;
        let y = this.pos.y;
        y -= rowsCount === 1 ? 0 : this.size.y / 2;
        x += offsetX * (this.currentChoise % 2);
        y += offsetY * Math.floor(this.currentChoise / 2);
        return new Vector(x, y);
    }
}