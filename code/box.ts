import { Vector } from "./math";
import { drawPolygon } from "./drawing";
import { STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE } from "fight";

const BOX_TRANSITION_SPEED = 0.9;
const POINT_EPSILON = 1e-3;

export function getRectanglePoints(pos: Vector, size: Vector) {
    return [new Vector(pos.x + size.x / 2, pos.y + size.y / 2),
    new Vector(pos.x - size.x / 2, pos.y + size.y / 2),
    new Vector(pos.x - size.x / 2, pos.y - size.y / 2),
    new Vector(pos.x + size.x / 2, pos.y - size.y / 2)];
}

export class Box {
    points = getRectanglePoints(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE);
    transitionTo = getRectanglePoints(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE);
    transitionSpeed = BOX_TRANSITION_SPEED;
    moveBy(speed: Vector) {
        let newPoints = [];
        for (let pointIndex = 0; pointIndex < this.points.length; pointIndex++) {
            newPoints.push(this.points[pointIndex].add(speed));
        }
        return newPoints;
    }
    draw() {
        drawPolygon(0, 0, "black", this.points);
        drawPolygon(0, 0, "white", this.points, 5);
    }
    startTransition(to: Vector[], speed: number) {
        this.transitionTo = to;
        this.transitionSpeed = speed;
    }
    updateTransition() {
        for (let pointIndex = 0; pointIndex < this.transitionTo.length; pointIndex++) {
            this.points[pointIndex] = this.points[pointIndex].add(this.transitionTo[pointIndex].sub(this.points[pointIndex]).mul(this.transitionSpeed));
        }
    }
    //returns true if is in transition
    checkTransition() {
        let res = false;
        for (let pointIndex = 0; pointIndex < this.transitionTo.length; pointIndex++) {
            if (this.points[pointIndex].sub(this.transitionTo[pointIndex]).length() > POINT_EPSILON) {
                res = true;
            }
        }
        return res;
    }
}