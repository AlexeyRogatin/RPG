startFight([new InvisibleMan()], getString("fight.start.enemy.invisibleman"));

function loop() {
    switch (state) {
        case STATE_FIGHT: {
            loopFight();
        } break;
    }
}

function mainLoop() {
    clearCanvas("black");

    loop();

    clearKeys();

    updateTimers();

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);