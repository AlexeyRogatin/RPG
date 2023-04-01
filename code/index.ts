import { clearCanvas } from "./drawing";
import { InvisibleMan } from "./enemies";
import { getString } from "./localization";
import { startFight, loopFight, state, GameState } from "./fight";
import { clearKeys } from "./input";
import { Timer } from "./timers";
import { loopWander } from "wander";
import { loopEdit } from "mapEditor";

function loop() {
    switch (state) {
        case GameState.FIGHT: {
            loopFight();
        } break;
        case GameState.WONDER: {
            loopWander();
        } break;
        case GameState.MAP_EDIT: {
            loopEdit();
        }
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