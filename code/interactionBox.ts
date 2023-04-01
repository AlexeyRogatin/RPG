import { CHOICE_RESULT_NONE, ChoiseBox, Option } from "./choiseBox";
import { Vector } from "./math";
import { TextBox } from "./textBox";
import { TEXT_BOX_SIZE_DIFF } from "./fight";

enum InteractionType {
    TEXT,
    CHOICE
}

export class Choise {
    option: Option;
    text: string;
    cons: () => {};
    constructor(option: Option, text: string, cons: () => {}) {
        this.option = option;
        this.text = text;
        this.cons = cons;
    }
}

export class Interaction {
    type = InteractionType.TEXT;
    text = "";
    choises: Choise[] = [];
    static getTextInteraction(text: string) {
        let inter = new Interaction;
        inter.type = InteractionType.TEXT;
        inter.text = text;
        return inter;
    }

    static getChoiseInteraction(choises: Choise[]) {
        let inter = new Interaction;
        inter.type = InteractionType.CHOICE;
        inter.choises = choises;
        return inter;
    }
}

export class InteractionBox {
    pos: Vector;
    size: Vector;
    textBox: TextBox;
    choiseBox: ChoiseBox;
    interactions: Interaction[] = [];
    interactionIndex = 0;
    result = CHOICE_RESULT_NONE;
    ended = false;
    constructor(pos: Vector, size: Vector) {
        this.pos = pos;
        this.size = size;
        this.textBox = new TextBox();
        this.textBox.setPos(pos, size.sub(TEXT_BOX_SIZE_DIFF));
        this.choiseBox = new ChoiseBox(pos, size.sub(TEXT_BOX_SIZE_DIFF));
    }
    setInteraction(interactions: Interaction[]) {
        this.interactionIndex = 0;
        this.interactions = interactions;
        this.ended = false;
        this.result = CHOICE_RESULT_NONE;
    }
    setNextInteraction() {
        this.interactionIndex++;
        switch (this.interactions[this.interactionIndex].type) {
            case InteractionType.TEXT: {
                this.textBox.newText(this.interactions[this.interactionIndex].text);
            } break;
            case InteractionType.CHOICE: {
                this.choiseBox.clear();
                for (let choiseIndex = 0; choiseIndex < this.interactions[this.interactionIndex].choises.length; choiseIndex++) {
                    this.choiseBox.options.push(this.interactions[this.interactionIndex].choises[choiseIndex].option);
                }
            } break;
        }
    }
    updateInteractions(heartPos: Vector) {
        if (!this.ended) {
            switch (this.interactions[this.interactionIndex].type) {
                case InteractionType.TEXT: {
                    this.textBox.updateText();
                } break;
                case InteractionType.CHOICE: {
                    let value = this.choiseBox.result;
                    heartPos = this.choiseBox.updateChoise(heartPos);
                    if (this.choiseBox.result != value) {
                        this.result = this.choiseBox.result;
                        this.interactions[this.interactionIndex].choises[this.choiseBox.result].cons();
                        if (this.interactions[this.interactionIndex].choises[this.choiseBox.result].text !== "") {
                            this.textBox.newText(this.interactions[this.interactionIndex].choises[this.choiseBox.result].text);
                        }
                    }
                } break;
            }
            if (this.textBox.read && this.choiseBox.result !== CHOICE_RESULT_NONE) {
                if (this.interactionIndex + 1 < this.interactions.length) {
                    this.setNextInteraction();
                } else {
                    this.ended = true;
                }
            }
        }
        return heartPos;
    }
    draw() {
        switch (this.interactions[this.interactionIndex].type) {
            case InteractionType.TEXT: {
                this.textBox.draw();
            } break;
            case InteractionType.CHOICE: {
                this.choiseBox.draw();
            } break;
        }
    }
}