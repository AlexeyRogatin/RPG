const STANDART_BOX_SIZE = new Vector(300, 300);
const STANDART_BOX_POS = new Vector(0, 130);
const STANDART_TEXT_BOX_SIZE = new Vector(1200, 240);
const STANDART_TEXT_BOX_POS = new Vector(0, 160);
const STANDART_BUTTON_SIZE = new Vector(220, 80);
const BUTTON_Y_OFFSET = 60;
const DISTANCE_BETWEEN_ENEMIES = canvas.width / 4;
const ENEMIES_POS_Y = -canvas.height / 4.4;

const POINT_BOTTOM_RIGHT = 0;
const POINT_BOTTOM_LEFT = 1;
const POINT_TOP_LEFT = 2;
const POINT_TOP_RIGHT = 3;

const BUTTON_FIGHT = 0;
const BUTTON_ACT = 1;
const BUTTON_ITEM = 2;
const BUTTON_MERCY = 3;

const STATES_COUNT = 2;
const STATE_MAIN = 0;
//already exists STATE_FIGHT = 1;
const STATE_CHOISE = 3;
const STATE_ACTIONS = 4;
const STATE_ITEMS = 5;
const STATE_TEXT = 6;
const STATE_HIT = 7;
const STATE_WON = 8;

const POINT_EPSILON = 1e-3;

const HEART_SIZE = new Vector(32, 32);

const TREMBLE_FREQUENCY = 6;
const TREMBLE_AMOUNT = 1;

const TEXT_BOX_OFFSET_X = 250;

const STATE_WONDER = 0;
const STATE_FIGHT = 1;
const STATE_DIALOGUE = 2;

let state = STATE_WONDER;

function startFight(enemies, phrase) {
    state = STATE_FIGHT;
    fight.enemies = enemies;
    fight.comment = phrase;
    for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
        let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
        let xPos = -width / 2 + DISTANCE_BETWEEN_ENEMIES * enemyIndex;
        fight.dialogueBoxes.push(new TextBox(new Vector(xPos + TEXT_BOX_OFFSET_X, ENEMIES_POS_Y), "", new Vector(200, 200), 25, "black"));
    }
}

let heart = {
    pos: new Vector(0, 0),
    speedConst: new Vector(4, 4),
    collisionRadius: 18,
    sprite: imgHeart,
    damage: 1,
    defence: 1,
    draw() {
        drawImage(this.pos.x, this.pos.y, HEART_SIZE.x, HEART_SIZE.y, 0, this.sprite);
    }
}

function isInRect(pos, rectPos, size) {
    return !(pos.x > rectPos.x + size.x / 2 ||
        pos.x < rectPos.x - size.x / 2 ||
        pos.y > rectPos.y + size.y / 2 ||
        pos.y < rectPos.y - size.y / 2
    );
}

class FightButton {
    constructor(pos, size, text, icon) {
        this.size = size;
        this.pos = pos;
        this.text = text;
        this.icon = icon;
        this.pressed = false;
        this.activated = false;
    }
    draw() {
        let color = "yellow";
        if (!this.pressed) {
            color = "orange";
            drawImage(this.pos.x - this.size.x / 3, this.pos.y, this.size.y * 0.66, this.size.y * 0.66, 0, this.icon);
        }
        drawRect(this.pos.x, this.pos.y, this.size.x, this.size.y, 0, color, 5);
        drawText(this.pos.x + this.size.x / 7, this.pos.y, this.text, Math.round(this.size.y * 0.5), "Big", true, color);
    }
    updateButton() {
        this.pressed = false;
        this.activated = false;
    }
    checkCollision(pos) {
        if (isInRect(pos, this.pos, this.size)) {
            this.pressed = true;
            if (keys[zKey].wentDown) {
                this.activated = true;
            }
        }
    }
}

function getRectanglePoints(pos, size) {
    return [new Vector(pos.x + size.x / 2, pos.y + size.y / 2),
    new Vector(pos.x - size.x / 2, pos.y + size.y / 2),
    new Vector(pos.x - size.x / 2, pos.y - size.y / 2),
    new Vector(pos.x + size.x / 2, pos.y - size.y / 2)];
}

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

//state functions
function winCondition() {
    let win = true;
    for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
        win = win && fight.enemies[enemyIndex].mercy === ENEMY_SPARED;
    }
    if (win) {
        toStateText(getString("fight.interface.won") + "\n");
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
    fight.fightState.state = STATE_DIALOGUE;
    fight.box.startTransition(getRectanglePoints(STANDART_BOX_POS, STANDART_BOX_SIZE), 0.5);
    fight.heart.pos = STANDART_BOX_POS;
    for (let textIndex = 0; textIndex < fight.dialogueBoxes.length; textIndex++) {
        fight.dialogueBoxes[textIndex].newText(fight.enemies[textIndex].nextPhrase());
    }
}

function updateTextInStateDialogue() {
    if (fight.fightState.state === STATE_DIALOGUE) {
        let dialogueOver = true;
        for (let textIndex = 0; textIndex < fight.dialogueBoxes.length; textIndex++) {
            fight.dialogueBoxes[textIndex].updateText();
            dialogueOver = dialogueOver && fight.dialogueBoxes[textIndex].read;
        }
        if (dialogueOver) {
            toStateFight();
        }
    }
}

function toStateFight() {
    fight.fightState.state = STATE_FIGHT;
    setTimer(fight.fightState.fightTimer, 300);
}

function movePlayerInFightState() {
    if (fight.fightState.state === STATE_FIGHT) {
        let speed = getMovingSpeed(fight.heart.speedConst);
        speed = checkRoundCollisionWithBox(fight.heart.pos, fight.heart.collisionRadius, speed, fight.box.points)
        fight.heart.pos = movePlayer(fight.heart.pos, speed);
    }
}

function endFightPhaseWithTimer() {
    if (timeExpired(fight.fightState.fightTimer) && fight.fightState.state === STATE_FIGHT) {
        toStateMain();
        fight.box.startTransition(getRectanglePoints(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE), 0.5);
        fight.comment = fight.nextComment();
    }
}

function toStateMain() {
    fight.fightState.state = STATE_MAIN;
    fight.pickedMove = -1;
}

function toStateText(text) {
    fight.textBox.newText(text);
    fight.fightState.state = STATE_TEXT;
}

function updateTextInTextState() {
    if (fight.fightState.state === STATE_TEXT) {
        fight.textBox.updateText();
        if (fight.textBox.read) {
            if (fight.pickedMove === BUTTON_MERCY) {
                state = STATE_WONDER;
            }
            toStateDialogue();
        }
    }
}

function toStateActions() {
    fight.choiseBox.clear();
    fight.fightState.state = STATE_ACTIONS;
    for (let actIndex = 0; actIndex < fight.enemies[fight.activeEnemy].acts.length; actIndex++) {
        fight.choiseBox.choises.push(fight.enemies[fight.activeEnemy].acts[actIndex].name);
        fight.choiseBox.colors.push("white");
        fight.choiseBox.availability.push(true);
    }
}

function updateChoiseInActionsState() {
    if (fight.fightState.state === STATE_ACTIONS) {
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
    fight.fightState.state = STATE_HIT;
    fight.hitBox.clear();
}

function updateHitInHitState() {
    if (fight.fightState.state === STATE_HIT) {
        fight.hitBox.updateIndicator();
        if (getTime(fight.hitBox.endingTimer) === HIT_TIME) {
            animHit.startAnimation(10, false);
        }
        if (fight.hitBox.ended) {
            fight.enemies[fight.activeEnemy].hitpoints -= fight.hitBox.value;
            toStateDialogue();
        }
    }
}

function toStateChoise() {
    fight.activeEnemy = -1;
    fight.choiseBox.clear();
    fight.fightState.state = STATE_CHOISE;
    for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
        fight.choiseBox.choises.push(fight.enemies[enemyIndex].name);
        fight.choiseBox.colors.push(fight.enemies[enemyIndex].mercy >= 1 ? "yellow" : "white");
        fight.choiseBox.availability.push(fight.enemies[enemyIndex].mercy === ENEMY_SPARED ? false : true);
    }
}

function updateChoiseInChoiseState() {
    if (fight.fightState.state === STATE_CHOISE) {
        fight.choiseBox.updateChoise(fight.heart);
        if (fight.choiseBox.result !== RESULT_NONE) {
            fight.activeEnemy = fight.choiseBox.result;
            if (fight.pickedMove === BUTTON_FIGHT) {
                toStateHit();
            }
            if (fight.pickedMove === BUTTON_ACT) {
                toStateActions();
            }
            if (fight.pickedMove === BUTTON_MERCY) {
                showMercy();
            }
        }
        if (keys[xKey].wentDown) {
            toStateMain();
        }
    }
}

function drawElements() {
    fight.buttons.forEach((button) => { button.draw(); });
    for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
        let enemy = fight.enemies[enemyIndex];
        let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
        let xPos = -width / 2 + DISTANCE_BETWEEN_ENEMIES * enemyIndex;
        if (fight.fightState.state === STATE_HIT && getTime(fight.hitBox.endingTimer) >= 0 &&
            fight.activeEnemy === enemyIndex) {
            let addPosX = 0;
            if (!animHit.playing) {
                let tremblePower = Math.floor(getTime(fight.hitBox.endingTimer) / TREMBLE_FREQUENCY);
                addPosX = ((Math.floor(tremblePower) % 2) * 2 - 1) * TREMBLE_AMOUNT * tremblePower;
            }
            enemy.draw(xPos + addPosX, ENEMIES_POS_Y, 1, false);
        } else {
            if (enemy.mercy === ENEMY_SPARED) {
                enemy.draw(xPos, ENEMIES_POS_Y, TRANSPARENCY, false);
            } else {
                enemy.draw(xPos, ENEMIES_POS_Y);
            }
        }
    }
    fight.box.draw();
    if (fight.fightState.state === STATE_MAIN) {
        if (!fight.box.checkTransition()) {
            drawParagraph(STANDART_TEXT_BOX_POS.x - (STANDART_TEXT_BOX_SIZE.x - 200) / 2,
                STANDART_TEXT_BOX_POS.y - (STANDART_TEXT_BOX_SIZE.y - 90) / 2,
                fight.comment, TEXT_KEGEL, "Big", false, "white", STANDART_TEXT_BOX_SIZE.x - 100, TEXT_KEGEL * 1.5);
        }
    }
    if (fight.fightState.state === STATE_CHOISE ||
        fight.fightState.state === STATE_ACTIONS) {
        fight.choiseBox.draw();
    }
    if (fight.fightState.state === STATE_TEXT) {
        fight.textBox.draw();
    }
    if (fight.fightState.state === STATE_HIT) {
        fight.hitBox.draw();
        if (getTime(fight.hitBox.endingTimer) <= HIT_TIME) {
            let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
            let xPos = -width / 2 + DISTANCE_BETWEEN_ENEMIES * fight.activeEnemy;
            drawImage(xPos, ENEMIES_POS_Y, 70 * FIGHT_IMAGE_SCALING, 120 * FIGHT_IMAGE_SCALING, 0, animHit);
        }
    }
    if (fight.fightState.state === STATE_DIALOGUE) {
        for (let textIndex = 0; textIndex < fight.dialogueBoxes.length; textIndex++) {
            if (fight.enemies[textIndex].mercy !== ENEMY_SPARED) {
                drawImage(fight.dialogueBoxes[textIndex].pos.x - fight.dialogueBoxes[textIndex].size.x / 2 * 0.3,
                    fight.dialogueBoxes[textIndex].pos.y - fight.dialogueBoxes[textIndex].size.y / 2 * 0.2,
                    fight.dialogueBoxes[textIndex].size.x * 1.125 * 1.1, fight.dialogueBoxes[textIndex].size.y * 1.1, 0, imgDialogueBox);
                fight.dialogueBoxes[textIndex].draw();
            }
        }
    }
    fight.heart.draw();
}

function pickMove() {
    if (fight.buttons[BUTTON_FIGHT].activated) {
        fight.pickedMove = BUTTON_FIGHT;
    }
    if (fight.buttons[BUTTON_ACT].activated) {
        fight.pickedMove = BUTTON_ACT;
    }
    if (fight.buttons[BUTTON_ITEM].activated) {
        fight.pickedMove = BUTTON_ITEM;
    }
    if (fight.buttons[BUTTON_MERCY].activated) {
        fight.pickedMove = BUTTON_MERCY;
    }
}

function activateButtonsInMainState() {
    if (fight.fightState.state === STATE_MAIN) {
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

function changeButtonInActiveState() {
    if (fight.fightState.state === STATE_MAIN) {
        fight.fightState.activeButton = fight.fightState.activeButton + (keys[rightKey].wentDown - keys[leftKey].wentDown);
        fight.fightState.activeButton = clamp(fight.fightState.activeButton, 0, fight.buttons.length - 1);

        fight.heart.pos = new Vector(fight.buttons[fight.fightState.activeButton].pos.x - fight.buttons[fight.fightState.activeButton].size.x / 3,
            fight.buttons[fight.fightState.activeButton].pos.y);
    }
}

function updateButtons() {
    fight.buttons.forEach((button) => { button.updateButton(); button.checkCollision(fight.heart.pos); });
}

let fight = {
    enemies: [],

    activeEnemy: -1,

    pickedMove: -1,

    fightState: {
        state: STATE_MAIN,
        fightTimer: getTimer(-1),
        activeButton: BUTTON_FIGHT,
    },

    buttons: [new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.fight"), imgFight),
    new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5 * 2, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.action"), imgAct),
    new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5 * 3, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.item"), imgItem),
    new FightButton(new Vector(-canvas.width / 2 + canvas.width / 5 * 4, canvas.height / 2 - BUTTON_Y_OFFSET),
        STANDART_BUTTON_SIZE, getString("fight.interface.mercy"), imgMercy)],

    box: {
        points: getRectanglePoints(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE),
        transitionTo: getRectanglePoints(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE),
        transitionSpeed: 0.9,
        moveBy(speed) {
            let newPoints = [];
            for (let pointIndex = 0; pointIndex < this.points.length; pointIndex++) {
                newPoints.push(this.points[pointIndex].add(speed));
            }
            return newPoints;
        },
        draw() {
            drawPolygon(0, 0, "black", this.points);
            drawPolygon(0, 0, "white", this.points, 5);
        },
        startTransition(to, speed) {
            this.transitionTo = to;
            this.transitionSpeed = speed;
        },
        updateTransition() {
            for (let pointIndex = 0; pointIndex < this.transitionTo.length; pointIndex++) {
                this.points[pointIndex] = this.points[pointIndex].add(this.transitionTo[pointIndex].sub(this.points[pointIndex]).mul(this.transitionSpeed));
            }
        },
        //returns true if is in transition
        checkTransition() {
            let res = false;
            for (let pointIndex = 0; pointIndex < this.transitionTo.length; pointIndex++) {
                if (this.points[pointIndex].sub(this.transitionTo[pointIndex]).length() > POINT_EPSILON) {
                    res = false;
                }
            }
            return res;
        }
    },

    heart: heart,

    choiseBox: new ChoiseBox(STANDART_TEXT_BOX_POS, [], STANDART_TEXT_BOX_SIZE.sub(new V2(200, 90))),

    textBox: new TextBox(STANDART_TEXT_BOX_POS, "", STANDART_TEXT_BOX_SIZE.sub(new V2(200, 90))),

    hitBox: new hitBox(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE),

    comment: "",

    dialogueBoxes: [],

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

function loopFight() {
    //checking buttons
    changeButtonInActiveState();
    activateButtonsInMainState();

    //moving box
    fight.box.updateTransition();

    //checking collision
    movePlayerInFightState();

    endFightPhaseWithTimer();

    updateChoiseInChoiseState();
    updateChoiseInActionsState();
    updateTextInTextState();
    updateHitInHitState();
    updateTextInStateDialogue();

    drawElements();

    //clear active states for buttons
    updateButtons();
}