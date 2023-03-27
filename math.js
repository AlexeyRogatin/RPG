class Vector {
    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toXY() {
        return this.x, this.y;
    }

    dot(vec) {
        return (this.x * vec.x + this.y * vec.y + this.z * vec.z);
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    cross(vec) {
        return new Vector(this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x,
        )
    }

    unit() {
        return this.div(this.length());
    }

    add(b) {
        return new Vector(this.x + b.x,
            this.y + b.y,
            this.z + b.z);
    }

    sub(b) {
        return new Vector(this.x - b.x,
            this.y - b.y,
            this.z - b.z);
    }

    mul(c) {
        return new Vector(this.x * c,
            this.y * c,
            this.z * c);
    }

    div(c) {
        return new Vector(this.x / c,
            this.y / c,
            this.z / c);
    }
}

Vector["+"] = function (operand, rev) {
    return Vector(rev.x + operand.x,
        rev.y + operand.y,
        rev.z + operand.z);
}

Vector["-"] = function (operand, rev) {
    return Vector(rev.x - operand.x,
        rev.y - operand.y,
        rev.z - operand.z);
}

Vector["*"] = function (operand, rev) {
    return Vector(rev.x * operand,
        rev.y * operand,
        rev.z * operand);
}

Vector["/"] = function (operand, rev) {
    return Vector(rev.x / operand,
        rev.y / operand,
        rev.z / operand);
}

class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toXY() {
        return this.x, this.y;
    }

    dot(vec) {
        return (this.x * vec.x + this.y * vec.y);
    }

    length() {
        return Math.sqrt(dot(this));
    }

    cross(vec) {
        return new Vector()
    }
}

function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(getRandomFloat(min, max + 0.999));
}