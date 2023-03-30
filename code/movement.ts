import { Vector } from "./math";
import { rightKey, leftKey, downKey, upKey } from "./input";

//move functions
export function getMovingSpeed(speed: Vector) {
    return new Vector(
        (Number(rightKey.isDown) - Number(leftKey.isDown)) * speed.x,
        (Number(downKey.isDown) - Number(upKey.isDown)) * speed.y
    );
}

export function movePlayer(pos: Vector, speed: Vector) {
    return pos.add(speed);
}
