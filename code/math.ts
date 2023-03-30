export class Vector {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toXY() {
        return this.x, this.y;
    }

    dot(vec: Vector) {
        return (this.x * vec.x + this.y * vec.y + this.z * vec.z);
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    cross(vec: Vector) {
        return new Vector(this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x,
        )
    }

    unit() {
        return this.div(this.length());
    }

    add(b: Vector) {
        return new Vector(this.x + b.x,
            this.y + b.y,
            this.z + b.z);
    }

    sub(b: Vector) {
        return new Vector(this.x - b.x,
            this.y - b.y,
            this.z - b.z);
    }

    mul(c: number) {
        return new Vector(this.x * c,
            this.y * c,
            this.z * c);
    }

    div(c: number) {
        return new Vector(this.x / c,
            this.y / c,
            this.z / c);
    }
}

export function clamp(value: number, min: number, max: number) {
    return Math.max(Math.min(value, max), min);
}

export function getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min: number, max: number) {
    return Math.floor(getRandomFloat(min, max + 0.999));
}

export function isInRect(pos: Vector, rectPos: Vector, size: Vector) {
    return !(pos.x > rectPos.x + size.x / 2 ||
        pos.x < rectPos.x - size.x / 2 ||
        pos.y > rectPos.y + size.y / 2 ||
        pos.y < rectPos.y - size.y / 2
    );
}