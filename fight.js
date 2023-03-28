const STANDART_BOX_SIZE = new Vector(300, 300);
const STANDART_BOX_POS = new Vector(0, 130);
const STANDART_TEXT_BOX_SIZE = new Vector(1200, 240);
const STANDART_TEXT_BOX_POS = new Vector(0, 160);
const STANDART_BUTTON_SIZE = new Vector(220, 80);
const BUTTON_Y_OFFSET = 60;
const DISTANCE_BETWEEN_ENEMIES = canvas.width / 4;
const ENEMIES_POS_Y = -canvas.height / 4.4;
const POINT_EPSILON = 1e-3;

const POINT_BOTTOM_RIGHT = 0;
const POINT_BOTTOM_LEFT = 1;
const POINT_TOP_LEFT = 2;
const POINT_TOP_RIGHT = 3;

const BUTTON_FIGHT = 0;
const BUTTON_ACT = 1;
const BUTTON_ITEM = 2;
const BUTTON_MERCY = 3;

const FIGHT_STATE_MAIN = 0;
const FIGHT_STATE_FIGHT = 1;
const FIGHT_STATE_DIALOGUE = 2;
const FIGHT_STATE_CHOISE = 3;
const FIGHT_STATE_ACTIONS = 4;
const FIGHT_STATE_ITEMS = 5;
const FIGHT_STATE_TEXT = 6;
const FIGHT_STATE_HIT = 7;

const TREMBLE_FREQUENCY = 6;
const TREMBLE_AMOUNT = 1;

const TEXT_BOX_OFFSET_X = 250;

function getEnemyPosX(enemyIndex) {
    let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
    let posX = -width / 2 + DISTANCE_BETWEEN_ENEMIES * enemyIndex;
    return posX;
}

function startFight(enemies, phrase) {
    state = STATE_FIGHT;
    fight.enemies = enemies;
    fight.comment = phrase;
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
    fight.state = FIGHT_STATE_DIALOGUE;

    fight.box.startTransition(getRectanglePoints(STANDART_BOX_POS, STANDART_BOX_SIZE), 0.5);
    fight.heart.pos = STANDART_BOX_POS;

    for (let textIndex = 0; textIndex < fight.enemies.length; textIndex++) {
        fight.enemies[textIndex].setNextText();
    }
}

function updateTextInStateDialogue() {
    if (fight.state === FIGHT_STATE_DIALOGUE) {
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
    fight.state = FIGHT_STATE_FIGHT;
    //TODO place with fight timer
    setTimer(fight.fightTimer, 10);
}

function movePlayerInFightState() {
    if (fight.state === FIGHT_STATE_FIGHT) {
        let speed = getMovingSpeed(fight.heart.speedConst);
        speed = checkRoundCollisionWithBox(fight.heart.pos, fight.heart.collisionRadius, speed, fight.box.points)
        fight.heart.pos = movePlayer(fight.heart.pos, speed);
    }
}

function endFightPhaseWithTimer() {
    if (timeExpired(fight.fightTimer) && fight.state === FIGHT_STATE_FIGHT) {
        toStateMain();
        fight.box.startTransition(getRectanglePoints(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE), 0.5);
        fight.comment = fight.nextComment();
    }
}

function toStateMain() {
    fight.state = FIGHT_STATE_MAIN;
}

function toStateText(text) {
    fight.textBox.newText(text);
    fight.state = FIGHT_STATE_TEXT;
}

function updateTextInTextState() {
    if (fight.state === FIGHT_STATE_TEXT) {
        fight.textBox.updateText();
        if (fight.textBox.read) {
            if (fight.activeButton === BUTTON_MERCY || fight.activeButton === BUTTON_FIGHT) {
                state = STATE_WONDER;
            } else {
                toStateDialogue();
            }
        }
    }
}

function toStateActions() {
    fight.choiseBox.clear();
    fight.state = FIGHT_STATE_ACTIONS;
    for (let actIndex = 0; actIndex < fight.enemies[fight.activeEnemy].acts.length; actIndex++) {
        fight.choiseBox.choises.push(fight.enemies[fight.activeEnemy].acts[actIndex].name);
        fight.choiseBox.colors.push("white");
        fight.choiseBox.availability.push(true);
    }
}

function updateChoiseInActionsState() {
    if (fight.state === FIGHT_STATE_ACTIONS) {
        fight.choiseBox.updateChoise(fight.heart);
        if (fight.choiseBox.result !== RESULT_NONE) {
            let act = fight.enemies[fight.activeEnemy].acts[fight.choiseBox.result];
            act.cons(fight.enemies, fight.activeEnemy, fight.choiseBox.result, fight.heart);
            toStateText(act.text);
        }
        if (keys[xKey].wentDown) {
            toStateChoise();
        }
    }
}

function toStateHit() {
    fight.state = FIGHT_STATE_HIT;
    fight.hitBox.clear();
}

function updateHitInHitState() {
    if (fight.state === FIGHT_STATE_HIT) {

        fight.hitBox.updateIndicator();
        fight.healthbox.update();
        if (fight.hitBox.ended) {
            {
                if (fight.hitBox.ended === ENDED_VALUE_HIT) {
                    animHit.startAnimation(10, false);
                }
                else if (getTime(animHit.changeTimer) === 0) {
                    let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
                    let xPos = -width / 2 + DISTANCE_BETWEEN_ENEMIES * fight.activeEnemy;
                    let damage = Math.ceil(heart.damage * fight.hitBox.value);
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
    fight.state = FIGHT_STATE_CHOISE;
    for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
        fight.choiseBox.choises.push(fight.enemies[enemyIndex].name);
        fight.choiseBox.colors.push(fight.enemies[enemyIndex].mercy >= 1 ? "yellow" : "white");
        fight.choiseBox.availability.push(fight.enemies[enemyIndex].defeated() ? false : true);
    }
}

function updateChoiseInChoiseState() {
    if (fight.state === FIGHT_STATE_CHOISE) {
        fight.choiseBox.updateChoise(fight.heart);
        if (fight.choiseBox.result !== RESULT_NONE) {
            fight.activeEnemy = fight.choiseBox.result;
            if (fight.activeButton === BUTTON_FIGHT) {
                toStateHit();
            }
            if (fight.activeButton === BUTTON_ACT) {
                toStateActions();
            }
            if (fight.activeButton === BUTTON_MERCY) {
                showMercy();
            }
        }
        if (keys[xKey].wentDown) {
            toStateMain();
        }
    }
}

function drawEnemy(enemyIndex) {
    let enemy = fight.enemies[enemyIndex];
    let posX = getEnemyPosX(enemyIndex);
    //enemy is not mooving when it is hit
    if (fight.state === FIGHT_STATE_HIT && fight.hitBox.ended &&
        fight.activeEnemy === enemyIndex) {
        let addPosX = 0;
        //enemy is trembling after hit
        if (!animHit.playing) {
            let tremblePower = Math.floor(getTime(fight.healthbox.timer) / TREMBLE_FREQUENCY);
            addPosX = ((Math.floor(tremblePower) % 2) * 2 - 1) * TREMBLE_AMOUNT * tremblePower;
        }
        enemy.draw(posX + addPosX, ENEMIES_POS_Y, 1, false);
    } else {
        enemy.draw(posX, ENEMIES_POS_Y);
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
    if (fight.state === FIGHT_STATE_MAIN) {
        drawMenuComments();
    }
    if (fight.state === FIGHT_STATE_CHOISE ||
        fight.state === FIGHT_STATE_ACTIONS) {
        fight.choiseBox.draw();
    }
    if (fight.state === FIGHT_STATE_TEXT) {
        fight.textBox.draw();
    }
    if (fight.state === FIGHT_STATE_HIT) {
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
    if (fight.state === FIGHT_STATE_DIALOGUE) {
        for (let textIndex = 0; textIndex < fight.enemies.length; textIndex++) {
            if (!fight.enemies[textIndex].defeated()) {
                fight.enemies[textIndex].drawDialogueBox();
            }
        }
    }
    fight.heart.draw();
}

function pickMove() {
    if (fight.buttons[BUTTON_FIGHT].activated) {
        fight.activeButton = BUTTON_FIGHT;
    }
    if (fight.buttons[BUTTON_ACT].activated) {
        fight.activeButton = BUTTON_ACT;
    }
    if (fight.buttons[BUTTON_ITEM].activated) {
        fight.activeButton = BUTTON_ITEM;
    }
    if (fight.buttons[BUTTON_MERCY].activated) {
        fight.activeButton = BUTTON_MERCY;
    }
}

function activateButtonsInMainState() {
    if (fight.state === FIGHT_STATE_MAIN) {
        if (fight.buttons[BUTTON_FIGHT].activated ||
            fight.buttons[BUTTON_ACT].activated ||
            fight.buttons[BUTTON_MERCY].activated) {
            toStateChoise()
        }
        if (fight.buttons[BUTTON_ITEM].activated) {

        }

        pickMove();
    }
}

function changeButtonInMainState() {
    if (fight.state === FIGHT_STATE_MAIN) {
        fight.activeButton = fight.activeButton + (keys[rightKey].wentDown - keys[leftKey].wentDown);
        fight.activeButton = clamp(fight.activeButton, 0, fight.buttons.length - 1);

        fight.heart.pos = new Vector(fight.buttons[fight.activeButton].pos.x - fight.buttons[fight.activeButton].size.x / 3,
            fight.buttons[fight.activeButton].pos.y);
    }
}

function updateButtons() {
    fight.buttons.forEach((button) => { button.updateButton(); button.checkCollision(fight.heart.pos); });
}

let fight = {
    state: FIGHT_STATE_MAIN,

    //for fight state
    fightTimer: getTimer(-1),

    enemies: [],

    //enemy with which you are interacting
    activeEnemy: -1,

    buttons: [new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.fight"), imgFight),
    new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5 * 2, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.action"), imgAct),
    new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5 * 3, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.item"), imgItem),
    new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5 * 4, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.mercy"), imgMercy)],

    activeButton: BUTTON_FIGHT,

    box: new Box(),

    heart: heart,

    choiseBox: new ChoiseBox(STANDART_TEXT_BOX_POS, [], STANDART_TEXT_BOX_SIZE.sub(new V2(200, 90))),

    textBox: new TextBox(),

    hitBox: new hitBox(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE),

    comment: "",

    healthbox: new HealthBox(),

    nextComment() {
        let found = false;
        for (let enemyIndex = 0; enemyIndex < this.enemies.length; enemyIndex++) {
            if (this.enemies[enemyIndex].obligatoryComments.length > 0) {
                found = true;
                return this.enemies[enemyIndex].nextComment();
            }
        }
        if (!found) {
            let randomIndex = getRandomInt(0, this.enemies.length - 1);
            return this.enemies[randomIndex].nextComment();
        }
    }
}

fight.textBox.setPos(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE.sub(new V2(200, 90)));

function loopFight() {
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