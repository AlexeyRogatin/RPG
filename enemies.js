const ENEMY_SPARED = -1;

const DIALOGUE_BOX_OFFSET = new Vector(200, 0);
const DIALOGUE_BOX_SIZE = new Vector(130, 130);

class Enemy {
    pos;
    hitpoints;
    maxHitpoints;
    damage;
    defence;
    tempDefence = 0;
    tempDamage = 0;
    mercy = 0;

    //for check information
    name;
    description;

    //check act is alredy made
    acts = [new Act(getString("action.check"), "", checkText)];

    //what happens if you mercy not yellow enemy
    mercyAct = emptyFunction;

    //body parts
    //in main condition
    mainParts = [];
    //when defeated
    partsDefeated = [];

    //comments
    //next comments
    obligatoryComments = [];
    //randomComments
    defaultComments = [];

    nextComment() {
        if (this.obligatoryComments.length > 0) {
            return this.obligatoryComments.shift();
        } else {
            return this.defaultComments[getRandomInt(0, this.defaultComments.length - 1)];
        }
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
    obligatoryPhrases = [];
    //random phrases
    defaultPhrases = [];

    nextPhrase() {
        if (this.obligatoryPhrases.length > 0) {
            return this.obligatoryPhrases.shift();
        } else {
            return this.defaultPhrases[getRandomInt(0, this.defaultPhrases.length - 1)];
        }
    }

    draw(x, y, move = true) {
        //body parts if alive
        let bodyParts = this.mainParts;
        //body parts when defeated
        if (this.hitpoints <= 0) {
            bodyParts = this.partsDefeated;
        }
        //spared
        if (this.mercy === ENEMY_SPARED) {
            ctx.globalAlpha = TRANSPARENCY;
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
            drawImage(x + partPos.x, y + partPos.y,
                part.img.width * FIGHT_IMAGE_SCALING, part.img.height * FIGHT_IMAGE_SCALING, 0, part.img);
        }
        ctx.globalAlpha = 1;
    }
}

function checkText(enemies, activeEnemy, activeAct, heart) {
    enemies[activeEnemy].acts[activeAct].text = enemies[activeEnemy].name + "\n" + getString("fight.interface.dmg") + " " +
        (enemies[activeEnemy].damage - enemies[activeEnemy].tempDamage) + " " + getString("fight.interface.def") + " " +
        (enemies[activeEnemy].defence - enemies[activeEnemy].tempDefence) + "\n" +
        enemies[activeEnemy].description;
}

let emptyFunction = (enemies, activeEnemy, activeAct, heart) => { };

class Act {
    constructor(name, text, cons) {
        this.name = name;
        this.text = text;
        this.cons = cons;
    }
}

const TRANSITION_NONE = 0;
const TRANSITION_LINEAR = 1;
const TRANSITION_SINUSOIDAL = 2;

class BodyPart {
    constructor(img, point1, point2, transitionType) {
        this.img = img;
        this.point1 = point1;
        this.point2 = point2;
        this.transitionType = transitionType;
    }
    getPos() {
        let transition;
        switch (this.transitionType) {
            case TRANSITION_NONE: {
                transition = 0;
            } break;
            case TRANSITION_LINEAR: {
                transition = Math.abs((-getTime(music.timer) % music.temp) / music.temp - 0.5) * 2;
            } break;
            case TRANSITION_SINUSOIDAL: {
                transition = Math.sin((-getTime(music.timer) % music.temp) / music.temp * 2 * Math.PI) / 2 + 0.5;
            } break;
        }
        let pos = this.point1.add(this.point2.sub(this.point1).mul(transition));
        return pos;
    }
}

const PARAGRAPH_SYM = "~";

//~ - знак перехода в следующее окно
class InvisibleMan extends Enemy {
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
            (enemies, activeEnemy, activeAct, heart) => { enemies[activeEnemy].tempAttack += 1; }));

        this.mainParts.push(new BodyPart(imgInvisibleManBoots, new Vector(0, 0), new Vector(0, 0), TRANSITION_NONE));
        this.mainParts.push(new BodyPart(imgInvisibleManTrench, new Vector(0, -10), new Vector(0, 5), TRANSITION_SINUSOIDAL));
        this.mainParts.push(new BodyPart(imgInvisibleManHead, new Vector(0, -10), new Vector(0, 20), TRANSITION_SINUSOIDAL));

        this.partsDefeated.push(new BodyPart(imgInvisibleManDefeat, new Vector(-2, 0), new Vector(2, 0), TRANSITION_SINUSOIDAL));

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