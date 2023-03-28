class FightButton {
    constructor(pos, size, text, icon) {
        this.size = size;
        this.pos = pos;
        this.text = text;
        this.icon = icon;
        this.pressed = false;
        this.activated = false;
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
    checkCollision(pos) {
        if (isInRect(pos, this.pos, this.size)) {
            this.pressed = true;
            if (keys[zKey].wentDown) {
                this.activated = true;
            }
        }
    }
}