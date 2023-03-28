const HEART_SIZE = new Vector(32, 32);

const STATE_WONDER = 0;
const STATE_FIGHT = 1;

let state = STATE_WONDER;

let heart = {
    pos: new Vector(0, 0),
    speedConst: new Vector(4, 4),
    collisionRadius: 18,
    sprite: imgHeart,
    damage: 1,
    defence: 1,
    draw() {
        drawImage(this.pos.x, this.pos.y, HEART_SIZE.x, HEART_SIZE.y, 0, this.sprite);
    }
}