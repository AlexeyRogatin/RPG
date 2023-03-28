function isInRect(pos, rectPos, size) {
    return !(pos.x > rectPos.x + size.x / 2 ||
        pos.x < rectPos.x - size.x / 2 ||
        pos.y > rectPos.y + size.y / 2 ||
        pos.y < rectPos.y - size.y / 2
    );
}

function checkPointCollisionWithWall(pos, speed, wall, normal) {
    //new round collision position
    let newPos = pos.add(speed).sub(wall[0]);

    let depth = newPos.dot(normal);
    if (depth < 0) {
        speed = speed.sub(normal.mul(depth * 0.99));
    }
    return speed;
}

//wall - is a vector array of 2 elements
function checkRoundCollisionWithWall(pos, radius, speed, wall) {
    //wall vector
    let wallVec = wall[1].sub(wall[0]);
    //separating vector
    let toObjVec = pos.sub(wall[0]);
    //normalVector
    let normal = wallVec.cross(toObjVec).cross(wallVec).unit();
    //make wall closer to round by radius
    let offset = normal.mul(radius);
    let newWall = [wall[0].add(offset), wall[1].add(offset)];

    return checkPointCollisionWithWall(pos, speed, newWall, normal);
}

function checkRoundCollisionWithBox(pos, radius, speed, points) {
    for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
        let point1 = points[pointIndex];
        let point2 = points[(pointIndex + 1) % points.length];
        speed = checkRoundCollisionWithWall(pos, radius, speed, [point1, point2]);
    }
    return speed;
}