import { clearCanvas } from "./drawing";
import { InvisibleMan } from "./enemies";
import { getString } from "./localization";
import { startFight, state, loopFight, GameState } from "./fight";
import { clearKeys } from "./input";
import { Timer } from "./timers";
import { loopWander } from "wander.js";

function loop() {
    switch (state) {
        case GameState.FIGHT: {
            loopFight();
        } break;
        case GameState.WONDER: {
            loopWander();
        } break;
    }
}

function mainLoop() {
    clearCanvas("grey");

    loop();

    clearKeys();

    Timer.updateTimers();

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);