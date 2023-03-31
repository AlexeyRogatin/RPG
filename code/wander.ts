import { Vector } from "./math";
import { getMovingSpeed, movePlayer } from "movement";
import { AnimatedImg, animLexaWalk, imgLexaSideRight, animLexaWalkBack, imgLexaSideLeft, animLexaWalkSideRight, animLexaWalkSideLeft, imgLexa, imgLexaBack, imgNone, Img } from "./resources";
import { drawImage, camera, drawRect } from "./drawing";
import { enterKey, xKey } from "./input";
import { startFight } from "./fight";
import { InvisibleMan } from "./enemies";
import { getString } from "./localization";

const WALK_ANIMATION_SPEED = 10;
const RUN_ANIMATION_SPEED = 6;

const WALK_SPEED = 5;
const RUN_SPEED_MULTIPLIER = 2;

class Player {
    pos: Vector = new Vector(0, 0);
    speedConst = new Vector(WALK_SPEED, WALK_SPEED);

    sprite: Img = imgNone;

    frontIdle: Img = imgNone;
    backIdle: Img = imgNone;
    sideIdleRight: Img = imgNone;
    sideIdleLeft: Img = imgNone;

    frontMovement: AnimatedImg = new AnimatedImg();
    backMovement: AnimatedImg = new AnimatedImg();
    sideMovementRight: AnimatedImg = new AnimatedImg();
    sideMovementLeft: AnimatedImg = new AnimatedImg();

    initWalkAnimations() {
        this.frontMovement.startAnimation(WALK_ANIMATION_SPEED, true);
        this.backMovement.startAnimation(WALK_ANIMATION_SPEED, true);
        this.sideMovementRight.startAnimation(WALK_ANIMATION_SPEED, true);
        this.sideMovementLeft.startAnimation(WALK_ANIMATION_SPEED, true);
    }

    changeAnimationsSpeed(delay: number) {
        this.frontMovement.changeDelay(delay);
        this.backMovement.changeDelay(delay);
        this.sideMovementRight.changeDelay(delay);
        this.sideMovementLeft.changeDelay(delay);
    }

    chooseSprite(speed: Vector) {
        if (speed.y > 0) {
            this.sprite = this.frontMovement;
        }
        else if (speed.y < 0) {
            this.sprite = this.backMovement;
        }
        else if (speed.x > 0) {
            this.sprite = this.sideMovementRight;
        }
        else if (speed.x < 0) {
            this.sprite = this.sideMovementLeft;
        } else {
            switch (this.sprite) {
                case this.frontMovement: {
                    this.sprite = this.frontIdle;
                } break;
                case this.backMovement: {
                    this.sprite = this.backIdle;
                } break;
                case this.sideMovementRight: {
                    this.sprite = this.sideIdleRight;
                } break;
                case this.sideMovementLeft: {
                    this.sprite = this.sideIdleLeft;
                } break;
            }
        }
    }

    draw() {
        drawImage(this.pos.x, this.pos.y, undefined, undefined, 0, this.sprite);
    }
}

class Lexa extends Player {
    sprite = imgLexa;

    frontIdle = imgLexa;
    backIdle = imgLexaBack;
    sideIdleRight = imgLexaSideRight;
    sideIdleLeft = imgLexaSideLeft;
    frontMovement = animLexaWalk;
    backMovement = animLexaWalkBack;
    sideMovementRight = animLexaWalkSideRight;
    sideMovementLeft = animLexaWalkSideLeft;

    constructor() {
        super();
        this.initWalkAnimations();
    }
}

let player = new Lexa();

function updatePlayer(player: Player) {
    let multiplier = 1;
    if (xKey.isDown) {
        player.changeAnimationsSpeed(RUN_ANIMATION_SPEED);
        multiplier *= RUN_SPEED_MULTIPLIER;
    } else {
        player.changeAnimationsSpeed(WALK_ANIMATION_SPEED);
    }

    let speed = getMovingSpeed(player.speedConst.mul(multiplier));
    player.chooseSprite(speed);
    player.pos = movePlayer(player.pos, speed);
    camera.pos = player.pos;
    player.draw();
}

export function loopWander() {
    if (enterKey.wentDown) {
        startFight([new InvisibleMan(), new InvisibleMan()], getString("fight.start.enemy.invisibleman"));
    }
    updatePlayer(player);
    drawRect(0, 0, 100, 100, 0, "red");
}