//move functions
function getMovingSpeed(speed) {
    return new Vector(
        (keys[rightKey].isDown - keys[leftKey].isDown) * speed.x,
        (keys[downKey].isDown - keys[upKey].isDown) * speed.y
    );
}

function movePlayer(pos, speed) {
    return pos.add(speed);
}
