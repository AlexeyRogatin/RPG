import { Vector } from "./math";
import { getRandomInt } from "./math";
import { DialogueBox } from "./dialogueBox";
import { TRANSPARENCY, drawImage } from "./drawing";
import { Heart } from "fight";
import { getString } from "localization";
import { AnimatedImg, Img, imgInvisibleManBoots, imgInvisibleManDefeat, imgInvisibleManHead, imgInvisibleManTrench } from "./resources";
import { music } from "./music";

export const ENEMY_SPARED = -1;

const DIALOGUE_BOX_OFFSET = new Vector(200, 0);
const DIALOGUE_BOX_SIZE = new Vector(140, 140);

export const PARAGRAPH_SYM = "~";

export class Enemy {
    pos: Vector = new Vector(0, 0);
    hitpoints: number = 0;
    maxHitpoints: number = 0;
    damage: number = 0;
    defence: number = 0;
    tempDefence = 0;
    tempDamage = 0;
    mercy = 0;

    //for check information
    name: string = "";
    description: string = "";

    //check act is alredy made
    acts = [new Act(getString("action.check"), "", checkText)];

    //what happens if you mercy not yellow enemy
    mercyAct = emptyFunction;

    //body parts
    //in main condition
    mainParts: BodyPart[] = [];
    //when defeated
    partsDefeated: BodyPart[] = [];

    //comments
    //next comments
    obligatoryComments: string[] = [];
    //randomComments
    defaultComments: string[] = [];

    nextComment() {
        let str = this.obligatoryComments.shift();
        if (str === undefined) {
            str = this.defaultComments[getRandomInt(0, this.defaultComments.length - 1)];
        }
        return str;
    }

    killed() {
        return this.hitpoints <= 0;
    }

    spared() {
        return this.mercy === ENEMY_SPARED;
    }

    defeated() {
        return this.killed() || this.spared();
    }

    dialogueBox = new DialogueBox();

    setNextText() {
        this.dialogueBox.newText(this.nextPhrase());
    }

    drawDialogueBox() {
        this.dialogueBox.setPos(this.pos.add(DIALOGUE_BOX_OFFSET), DIALOGUE_BOX_SIZE);

        this.dialogueBox.draw();
    }

    dialogueRead() {
        return this.dialogueBox.read();
    }

    //phrases
    //next phrases
    obligatoryPhrases: string[] = [];
    //random phrases
    defaultPhrases: string[] = [];

    nextPhrase(): string {
        let str = this.obligatoryPhrases.shift();
        if (str === undefined) {
            str = this.defaultPhrases[getRandomInt(0, this.defaultPhrases.length - 1)];
        }
        return str;
    }

    draw(pos: Vector, move = true) {
        //body parts if alive
        let bodyParts = this.mainParts;
        //body parts when defeated
        if (this.hitpoints <= 0) {
            bodyParts = this.partsDefeated;
        }
        //spared
        let alpha = 1;
        if (this.mercy === ENEMY_SPARED) {
            alpha = TRANSPARENCY;
            move = false;
        }

        for (let partIndex = 0; partIndex < bodyParts.length; partIndex++) {
            let part = bodyParts[partIndex];
            let partPos;
            if (move) {
                partPos = part.getPos();
            } else {
                partPos = part.point1;
            }
            drawImage(pos.x + partPos.x, pos.y + partPos.y, 0, 0, 0, part.img, alpha);
        }
    }
}

function checkText(enemies: Enemy[], activeEnemy: number, activeAct: number, heart: Heart) {
    enemies[activeEnemy].acts[activeAct].text = enemies[activeEnemy].name + "\n" + getString("fight.interface.dmg") + " " +
        (enemies[activeEnemy].damage - enemies[activeEnemy].tempDamage) + " " + getString("fight.interface.def") + " " +
        (enemies[activeEnemy].defence - enemies[activeEnemy].tempDefence) + "\n" +
        enemies[activeEnemy].description;
}

let emptyFunction = (enemies: Enemy[], activeEnemy: number, activeAct: number, heart: Heart) => { };

class Act {
    name: string;
    text: string;
    cons: (enemies: Enemy[], activeEnemy: number, activeAct: number, heart: Heart) => void;
    constructor(name: string, text: string, cons: (enemies: Enemy[], activeEnemy: number, activeAct: number, heart: Heart) => void) {
        this.name = name;
        this.text = text;
        this.cons = cons;
    }
}

enum Transitions {
    NONE,
    LINEAR,
    SINUSOIDAL,
}

class BodyPart {
    img: Img;
    point1: Vector;
    point2: Vector;
    transitionType: Transitions;

    constructor(img: Img, point1: Vector, point2: Vector, transitionType: Transitions) {
        this.img = img;
        this.point1 = point1;
        this.point2 = point2;
        this.transitionType = transitionType;
    }
    getPos() {
        let transition;
        switch (this.transitionType) {
            case Transitions.NONE: {
                transition = 0;
            } break;
            case Transitions.LINEAR: {
                transition = Math.abs((-music.timer.getTime() % music.temp) / music.temp - 0.5) * 2;
            } break;
            case Transitions.SINUSOIDAL: {
                transition = Math.sin((-music.timer.getTime() % music.temp) / music.temp * 2 * Math.PI) / 2 + 0.5;
            } break;
        }
        let pos = this.point1.add(this.point2.sub(this.point1).mul(transition));
        return pos;
    }
}

//~ - знак перехода в следующее окно
export class InvisibleMan extends Enemy {
    constructor() {
        super();
        this.hitpoints = 8;
        this.maxHitpoints = 8;
        this.damage = 1;
        this.defence = 1;

        this.name = getString("enemy.invisibleman");
        this.description = getString("enemy.invisibleman.action.check.result");

        this.acts.push(new Act(getString("enemy.invisibleman.action.confuse"),
            getString("enemy.invisibleman.action.confuse.result"),
            (enemies, activeEnemy, activeAct, heart) => { enemies[activeEnemy].defence += 1; }));
        this.acts.push(new Act(getString("enemy.invisibleman.action.threaten"),
            getString("enemy.invisibleman.action.threaten.result"),
            (enemies, activeEnemy, activeAct, heart) => {
                enemies[activeEnemy].mercy = 1;
                enemies[activeEnemy].obligatoryComments.push(getString("enemy.invisibleman.comments.reaction.threaten"));
                enemies[activeEnemy].obligatoryPhrases.push(getString("enemy.invisibleman.phrases.reaction.threaten"));
            }));
        this.acts.push(new Act(getString("enemy.invisibleman.action.ignore"),
            getString("enemy.invisibleman.action.ignore.result"),
            (enemies, activeEnemy, activeAct, heart) => { enemies[activeEnemy].tempDamage += 1; }));

        this.mainParts.push(new BodyPart(imgInvisibleManBoots, new Vector(0, 0), new Vector(0, 0), Transitions.NONE));
        this.mainParts.push(new BodyPart(imgInvisibleManTrench, new Vector(0, -10), new Vector(0, 5), Transitions.SINUSOIDAL));
        this.mainParts.push(new BodyPart(imgInvisibleManHead, new Vector(0, -10), new Vector(0, 20), Transitions.SINUSOIDAL));

        this.partsDefeated.push(new BodyPart(imgInvisibleManDefeat, new Vector(-2, 0), new Vector(2, 0), Transitions.SINUSOIDAL));

        this.defaultComments.push(getString("enemy.invisibleman.comments.random.1"));
        this.defaultComments.push(getString("enemy.invisibleman.comments.random.2"));
        this.defaultComments.push(getString("enemy.invisibleman.comments.random.3"));
        this.defaultComments.push(getString("enemy.invisibleman.comments.random.4"));

        this.defaultPhrases.push(getString("enemy.invisibleman.phrases.random.1"));
        this.defaultPhrases.push(getString("enemy.invisibleman.phrases.random.2"));
        this.defaultPhrases.push(getString("enemy.invisibleman.phrases.random.3"));
        this.defaultPhrases.push(getString("enemy.invisibleman.phrases.random.4"));
        this.defaultPhrases.push(getString("enemy.invisibleman.phrases.random.5"));
        this.defaultPhrases.push(getString("enemy.invisibleman.phrases.random.6"));
    }
}