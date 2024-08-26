import { camera, canvas, clearCanvas } from "./drawing";
import { Enemy, InvisibleMan } from "./enemies";
import { getString } from "./localization";
import { startFight, loopFight, state, GameState } from "./fight";
import { clearKeys, mouse } from "./input";
import { Timer } from "./timers";
import { loopWander } from "./wander";
import { loopEdit } from "./mapEditor";

startFight([new InvisibleMan()], "Wow");

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

function updateMouse() {
    let rect = canvas.getBoundingClientRect();
    mouse.worldPos.x = (mouse.pos.x - canvas.width / 2 + camera.pos.x - rect.left);
    mouse.worldPos.y = (mouse.pos.y - canvas.height / 2 + camera.pos.y - rect.top);
}

function mainLoop() {
    clearCanvas("grey");

    updateMouse();

    loop();

    clearKeys();

    Timer.updateTimers();
}

const fps = 60;

setInterval(() => {
    requestAnimationFrame(mainLoop);
  }, 1000 / fps);

requestAnimationFrame(mainLoop);