import { Vector, getRandomInt, clamp } from "./math";
import { camera, canvas, clearCanvas, FIGHT_IMAGE_SCALING } from "./drawing";
import { Enemy, ENEMY_SPARED } from "./enemies";
import { imgHeart } from "./resources";
import { drawImage, drawParagraph, TEXT_KEGEL } from "./drawing";
import { Box } from "./box";
import { ChoiseBox, Option, CHOICE_RESULT_NONE } from "./choiseBox";
import { FightButton } from "./fightButton";
import { imgAct, imgFight, imgItem, imgMercy } from "./resources";
import { getString } from "./localization";
import { HitBox, HitState } from "./hitBox";
import { HealthBox } from "./healthBox";
import { TextBox } from "./textBox";
import { animHit } from "./resources";
import { getRectanglePoints } from "./box";
import { movePlayer } from "./movement";
import { checkRoundCollisionWithBox } from "./collisions";
import { getMovingSpeed } from "./movement";
import { xKey, leftKey, rightKey } from "./input";
import { Timer } from "./timers";
import { Interface } from "readline";

const STANDART_BOX_SIZE = new Vector(300, 300);
const STANDART_BOX_POS = new Vector(0, 130);
export const STANDART_TEXT_BOX_SIZE = new Vector(1500, 290);
export const STANDART_TEXT_BOX_POS = new Vector(0, 190);
export const TEXT_BOX_SIZE_DIFF = new Vector(200, 60);
const STANDART_BUTTON_SIZE = new Vector(250, 100);
const BUTTON_Y_OFFSET = 60;
const DISTANCE_BETWEEN_ENEMIES = canvas.width / 4;
const ENEMIES_POS_Y = -canvas.height / 4.4;

enum BoxPoint {
    BOTTOM_RIGHT,
    BOTTOM_LEFT,
    TOP_LEFT,
    TOP_RIGHT,
}

enum Button {
    FIGHT,
    ACT,
    ITEM,
    MERCY,
}

enum FightState {
    MAIN,
    FIGHT,
    DIALOGUE,
    CHOICE,
    ACTIONS,
    ITEMS,
    TEXT,
    HIT
}

const TREMBLE_FREQUENCY = 6;
const TREMBLE_AMOUNT = 1;

const TEXT_BOX_OFFSET_X = 250;

const HEART_SIZE = new Vector(32, 32);

export enum GameState {
    FIGHT,
    WONDER,
    MAP_EDIT,
}

export let state = GameState.MAP_EDIT;

export class Heart {
    pos = new Vector(0, 0);
    collisionRadius = 18;
    sprite = imgHeart;
    damage = 1;
    defence = 1;
    speedConst = new Vector(2, 2);
    draw() {
        drawImage(this.pos.x, this.pos.y, HEART_SIZE.x, HEART_SIZE.y, 0, this.sprite);
    }
}

let heart = new Heart();

function getEnemyPosX(enemyIndex: number) {
    let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
    let posX = -width / 2 + DISTANCE_BETWEEN_ENEMIES * enemyIndex;
    return posX;
}

export function startFight(enemies: Enemy[], phrase: string) {
    fight = new Fight(heart);
    state = GameState.FIGHT;
    fight.enemies = enemies;
    fight.comment = phrase;
    fight.textBox.setPos(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE.sub(TEXT_BOX_SIZE_DIFF));
    for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
        fight.enemies[enemyIndex].pos = new Vector(getEnemyPosX(enemyIndex), ENEMIES_POS_Y);
    }
}

//state functions
//toState are executed one time
//update are executed every frame
function winCondition() {
    let win = true;
    for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
        win = win && fight.enemies[enemyIndex].defeated();
    }
    if (win) {
        toStateText(getString("fight.interface.won"));
    }
    return win;
}

function showMercy() {
    if (fight.enemies[fight.activeEnemy].mercy >= 1) {
        fight.enemies[fight.activeEnemy].mercy = ENEMY_SPARED;
        if (!winCondition()) {
            toStateDialogue();
        }
    } else {
        fight.enemies[fight.activeEnemy].mercyAct(fight.enemies, fight.activeEnemy, fight.choiseBox.result, fight.heart);
        toStateDialogue();
    }
}

function toStateDialogue() {
    fight.state = FightState.DIALOGUE;

    fight.box.startTransition(getRectanglePoints(STANDART_BOX_POS, STANDART_BOX_SIZE), 0.5);
    fight.heart.pos = STANDART_BOX_POS;

    for (let textIndex = 0; textIndex < fight.enemies.length; textIndex++) {
        fight.enemies[textIndex].setNextText();
    }
}

function updateTextInStateDialogue() {
    if (fight.state === FightState.DIALOGUE) {
        let dialogueOver = true;
        for (let textIndex = 0; textIndex < fight.enemies.length; textIndex++) {
            dialogueOver = dialogueOver && (fight.enemies[textIndex].dialogueRead() || fight.enemies[textIndex].defeated());
        }
        if (dialogueOver) {
            toStateFight();
        }
    }
}

function toStateFight() {
    fight.state = FightState.FIGHT;
    //TODO place with fight timer
    fight.fightTimer.setTime(10);
}

function movePlayerInFightState() {
    if (fight.state === FightState.FIGHT) {
        let speed = getMovingSpeed(fight.heart.speedConst);
        speed = checkRoundCollisionWithBox(fight.heart.pos, fight.heart.collisionRadius, speed, fight.box.points)
        fight.heart.pos = movePlayer(fight.heart.pos, speed);
    }
}

function endFightPhaseWithTimer() {
    if (fight.fightTimer.timeExpired() && fight.state === FightState.FIGHT) {
        toStateMain();
        fight.box.startTransition(getRectanglePoints(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE), 0.5);
        fight.comment = fight.nextComment();
    }
}

function toStateMain() {
    fight.state = FightState.MAIN;
}

function toStateText(text: string) {
    fight.textBox.newText(text);
    fight.state = FightState.TEXT;
}

function updateTextInTextState() {
    if (fight.state === FightState.TEXT) {
        fight.textBox.updateText();
        if (fight.textBox.read) {
            if (fight.activeButton === Button.MERCY || fight.activeButton === Button.FIGHT) {
                state = GameState.WONDER;
            } else {
                toStateDialogue();
            }
        }
    }
}

function toStateActions() {
    fight.choiseBox.clear();
    fight.state = FightState.ACTIONS;
    for (let actIndex = 0; actIndex < fight.enemies[fight.activeEnemy].acts.length; actIndex++) {
        fight.choiseBox.options.push(new Option(fight.enemies[fight.activeEnemy].acts[actIndex].name,
            "white",
            true));
    }
}

function updateChoiseInActionsState() {
    if (fight.state === FightState.ACTIONS) {
        fight.heart.pos = fight.choiseBox.updateChoise(fight.heart.pos);
        if (fight.choiseBox.result !== CHOICE_RESULT_NONE) {
            let act = fight.enemies[fight.activeEnemy].acts[fight.choiseBox.result];
            act.cons(fight.enemies, fight.activeEnemy, fight.choiseBox.result, fight.heart);
            toStateText(act.text);
        }
        if (xKey.wentDown) {
            toStateChoise();
        }
    }
}

function toStateHit() {
    fight.state = FightState.HIT;
    fight.hitBox.clear();
}

function updateHitInHitState() {
    if (fight.state === FightState.HIT) {

        fight.hitBox.updateIndicator();
        fight.healthbox.update();
        if (fight.hitBox.state !== HitState.PLAYING) {
            {
                if (fight.hitBox.state === HitState.LAND_HIT) {
                    animHit.startAnimation(10, false);
                }
                else if (animHit.changeTimer.getTime() === 0) {
                    let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
                    let xPos = -width / 2 + DISTANCE_BETWEEN_ENEMIES * fight.activeEnemy;
                    let damage = Math.ceil(heart.damage / fight.enemies[fight.activeEnemy].defence * fight.hitBox.value);
                    fight.healthbox.playAnimation(new Vector(xPos, ENEMIES_POS_Y), fight.enemies[fight.activeEnemy].hitpoints,
                        damage, fight.enemies[fight.activeEnemy].maxHitpoints);
                    fight.enemies[fight.activeEnemy].hitpoints -= damage;
                }
                else if (!animHit.playing && fight.healthbox.ended) {
                    if (!winCondition()) {
                        toStateDialogue();
                    }
                }
            }
        }
    }
}

function toStateChoise() {
    fight.activeEnemy = -1;
    fight.choiseBox.clear();
    fight.state = FightState.CHOICE;
    for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
        fight.choiseBox.options.push(new Option(fight.enemies[enemyIndex].name,
            fight.enemies[enemyIndex].mercy >= 1 ? "yellow" : "white",
            fight.enemies[enemyIndex].defeated() ? false : true));
    }
}

function updateChoiseInChoiseState() {
    if (fight.state === FightState.CHOICE) {
        fight.heart.pos = fight.choiseBox.updateChoise(fight.heart.pos);
        if (fight.choiseBox.result !== CHOICE_RESULT_NONE) {
            fight.activeEnemy = fight.choiseBox.result;
            if (fight.activeButton === Button.FIGHT) {
                toStateHit();
            }
            if (fight.activeButton === Button.ACT) {
                toStateActions();
            }
            if (fight.activeButton === Button.MERCY) {
                showMercy();
            }
        }
        if (xKey.wentDown) {
            toStateMain();
        }
    }
}

function drawEnemy(enemyIndex: number) {
    let enemy = fight.enemies[enemyIndex];
    let posX = getEnemyPosX(enemyIndex);
    //enemy is not mooving when it is hit
    if (fight.state === FightState.HIT && fight.hitBox.state === HitState.ENDED &&
        fight.activeEnemy === enemyIndex) {
        let addPosX = 0;
        //enemy is trembling after hit
        if (!animHit.playing) {
            let tremblePower = Math.floor(fight.healthbox.timer.getTime() / TREMBLE_FREQUENCY);
            addPosX = ((Math.floor(tremblePower) % 2) * 2 - 1) * TREMBLE_AMOUNT * tremblePower;
        }
        enemy.draw(new Vector(posX + addPosX, ENEMIES_POS_Y), false);
    } else {
        enemy.draw(new Vector(posX, ENEMIES_POS_Y));
    }
}

function drawEnemies() {
    for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
        drawEnemy(enemyIndex);
    }
}

function drawMenuComments() {
    if (!fight.box.checkTransition()) {
        drawParagraph(STANDART_TEXT_BOX_POS.x - (STANDART_TEXT_BOX_SIZE.x - 200) / 2,
            STANDART_TEXT_BOX_POS.y - (STANDART_TEXT_BOX_SIZE.y - 90) / 2,
            fight.comment, TEXT_KEGEL, "Big", false, "white", STANDART_TEXT_BOX_SIZE.x - 100, TEXT_KEGEL * 1.5);
    }
}

function drawElements() {
    fight.buttons.forEach((button) => { button.draw(); });
    drawEnemies();
    fight.box.draw();
    if (fight.state === FightState.MAIN) {
        drawMenuComments();
    }
    if (fight.state === FightState.CHOICE ||
        fight.state === FightState.ACTIONS) {
        fight.choiseBox.draw();
    }
    if (fight.state === FightState.TEXT) {
        fight.textBox.draw();
    }
    if (fight.state === FightState.HIT) {
        fight.hitBox.draw();
        if (animHit.playing) {
            let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
            let xPos = -width / 2 + DISTANCE_BETWEEN_ENEMIES * fight.activeEnemy;
            drawImage(xPos, ENEMIES_POS_Y, 70 * FIGHT_IMAGE_SCALING, 120 * FIGHT_IMAGE_SCALING, 0, animHit);
        }
        if (!fight.healthbox.ended) {
            fight.healthbox.draw();
        }
    }
    if (fight.state === FightState.DIALOGUE) {
        for (let textIndex = 0; textIndex < fight.enemies.length; textIndex++) {
            if (!fight.enemies[textIndex].defeated()) {
                fight.enemies[textIndex].drawDialogueBox();
            }
        }
    }
    fight.heart.draw();
}

function pickMove() {
    if (fight.buttons[Button.FIGHT].activated) {
        fight.activeButton = Button.FIGHT;
    }
    if (fight.buttons[Button.ACT].activated) {
        fight.activeButton = Button.ACT;
    }
    if (fight.buttons[Button.ITEM].activated) {
        fight.activeButton = Button.ITEM;
    }
    if (fight.buttons[Button.MERCY].activated) {
        fight.activeButton = Button.MERCY;
    }
}

function activateButtonsInMainState() {
    if (fight.state === FightState.MAIN) {
        if (fight.buttons[Button.FIGHT].activated ||
            fight.buttons[Button.ACT].activated ||
            fight.buttons[Button.MERCY].activated) {
            toStateChoise()
        }
        if (fight.buttons[Button.ITEM].activated) {

        }

        pickMove();
    }
}

function changeButtonInMainState() {
    if (fight.state === FightState.MAIN) {
        fight.activeButton = fight.activeButton + (Number(rightKey.wentDown) - Number(leftKey.wentDown));
        fight.activeButton = clamp(fight.activeButton, 0, fight.buttons.length - 1);

        fight.heart.pos = new Vector(fight.buttons[fight.activeButton].pos.x - fight.buttons[fight.activeButton].size.x / 3,
            fight.buttons[fight.activeButton].pos.y);
    }
}

function updateButtons() {
    fight.buttons.forEach((button) => { button.updateButton(); button.checkCollision(fight.heart.pos); });
}

class Fight {
    state: FightState = FightState.MAIN;

    fightTimer = new Timer(-1);

    enemies: Enemy[] = [];
    activeEnemy = -1;

    buttons: FightButton[] = [new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.fight"), imgFight),
    new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5 * 2, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.action"), imgAct),
    new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5 * 3, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.item"), imgItem),
    new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5 * 4, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.mercy"), imgMercy)];
    activeButton = Button.FIGHT;

    box: Box = new Box();
    heart: Heart;

    choiseBox = new ChoiseBox(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE.sub(new Vector(200, 90)));

    textBox = new TextBox();

    hitBox = new HitBox(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE);

    comment: string = "";

    healthbox = new HealthBox();

    constructor(heart: Heart) {
        this.heart = heart;
    }

    nextComment() {
        let randomIndex = getRandomInt(0, this.enemies.length - 1);
        let result = this.enemies[randomIndex].nextComment();
        for (let enemyIndex = 0; enemyIndex < this.enemies.length; enemyIndex++) {
            if (this.enemies[enemyIndex].obligatoryComments.length > 0) {
                result = this.enemies[enemyIndex].nextComment();
                break;
            }
        }
        return result;
    }
}

let fight: Fight;

export function loopFight() {
    camera.pos = new Vector(0, 0);

    clearCanvas("black");
    //moving box
    fight.box.updateTransition();

    //checking buttons
    changeButtonInMainState();
    activateButtonsInMainState();

    //checking collision
    movePlayerInFightState();
    endFightPhaseWithTimer();

    updateChoiseInChoiseState();
    updateChoiseInActionsState();

    updateHitInHitState();

    updateTextInTextState();
    updateTextInStateDialogue();

    //clear active states for buttons
    updateButtons();

    drawElements();

}