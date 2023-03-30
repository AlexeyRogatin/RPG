import { clearCanvas } from "./drawing";
import { InvisibleMan } from "./enemies";
import { getString } from "./localization";
import { startFight, state, loopFight, GameState } from "./fight";
import { clearKeys } from "./input";
import { Timer } from "./timers";

startFight([new InvisibleMan(), new InvisibleMan()], getString("fight.start.enemy.invisibleman"));

function loop() {
    switch (state) {
        case GameState.FIGHT: {
            loopFight();
        } break;
    }
}

function mainLoop() {
    clearCanvas("black");

    loop();

    clearKeys();

    Timer.updateTimers();

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);