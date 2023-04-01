declare module "math" {
    export class Vector {
        x: number;
        y: number;
        z: number;
        constructor(x: number, y: number, z?: number);
        toXY(): number;
        dot(vec: Vector): number;
        length(): number;
        cross(vec: Vector): Vector;
        unit(): Vector;
        add(b: Vector): Vector;
        sub(b: Vector): Vector;
        mul(c: number): Vector;
        div(c: number): Vector;
    }
    export function clamp(value: number, min: number, max: number): number;
    export function getRandomFloat(min: number, max: number): number;
    export function getRandomInt(min: number, max: number): number;
    export function isInRect(pos: Vector, rectPos: Vector, size: Vector): boolean;
}
declare module "timers" {
    export class Timer {
        static timers: Timer[];
        time: number;
        constructor(time: number);
        static updateTimers(): void;
        setTime(time: number): void;
        getTime(): number;
        timeExpired(): boolean;
    }
}
declare module "resources" {
    import { Timer } from "timers";
    export class Img {
        img: HTMLImageElement;
        width: number;
        height: number;
        drawWidth: number;
        drawHeight: number;
        constructor(src: string, invertedX?: boolean, invertedY?: boolean);
        updateImage(): void;
    }
    export class AnimatedImg extends Img {
        images: Img[];
        changeTimer: Timer;
        playing: boolean;
        delay: number;
        looped: boolean;
        constructor(invertedX?: boolean, invertedY?: boolean, ...args: any[]);
        startAnimation(delay: number, looped: boolean): void;
        changeDelay(delay: number): void;
        updateImage(): void;
    }
    export let imgNone: Img;
    export let imgHeart: Img;
    export let imgFight: Img;
    export let imgAct: Img;
    export let imgItem: Img;
    export let imgMercy: Img;
    export let imgDialogueBox: Img;
    export let imgDialogueBoxCorner: Img;
    export let imgDialogueBoxTail: Img;
    export let imgInvisibleManBoots: Img;
    export let imgInvisibleManTrench: Img;
    export let imgInvisibleManHead: Img;
    export let imgInvisibleManDefeat: Img;
    export let animHit: AnimatedImg;
    export let imgLexa: Img;
    export let imgLexaBack: Img;
    export let imgLexaSideRight: Img;
    export let imgLexaSideLeft: Img;
    export let animLexaWalk: AnimatedImg;
    export let animLexaWalkBack: AnimatedImg;
    export let animLexaWalkSideRight: AnimatedImg;
    export let animLexaWalkSideLeft: AnimatedImg;
}
declare module "drawing" {
    import { Vector } from "math";
    import { Img } from "resources";
    export const canvas: HTMLCanvasElement;
    export const FIGHT_IMAGE_SCALING = 4.3;
    export const TRANSPARENCY = 0.4;
    export const TEXT_KEGEL = 45;
    export let camera: {
        pos: Vector;
        scale: number;
    };
    export function drawRect(x: number, y: number, width: number, height: number, angle: number, color: string, lineWidth?: number, transparency?: number): void;
    export function clearCanvas(color: string): void;
    export function drawImage(x: number, y: number, width: number | undefined, height: number | undefined, angle: number, image: Img, transparency?: number): void;
    export function drawPolygon(x: number, y: number, color: string, points: Vector[], lineWidth?: number, transparency?: number): void;
    export function drawText(x: number, y: number, text: string, kegel: number, font: string, bold: boolean, color: string, textAlign?: CanvasTextAlign, textBaseline?: CanvasTextBaseline, transparency?: number, lineWidth?: number): void;
    export function drawParagraph(x: number, y: number, text: string, kegel: number, font: string, bold: boolean, color: string, width?: number, interval?: number, textBaseline?: CanvasTextBaseline, textAlign?: CanvasTextAlign, transparency?: number, lineWidth?: number): void;
}
declare module "input" {
    import { Vector } from "math";
    class Key {
        static keys: Key[];
        isDown: boolean;
        wentDown: boolean;
        wentUp: boolean;
        keyCode: number;
        constructor(keyCode: number);
    }
    class Mouse {
        pos: Vector;
        worldPos: Vector;
        isDown: boolean;
        wentDown: boolean;
        wentUp: boolean;
    }
    export let upKey: Key;
    export let downKey: Key;
    export let leftKey: Key;
    export let rightKey: Key;
    export let zKey: Key;
    export let xKey: Key;
    export let enterKey: Key;
    export let nKey: Key;
    export let cKey: Key;
    export let lKey: Key;
    export let iKey: Key;
    export let eKey: Key;
    export let dKey: Key;
    export let mouse: Mouse;
    export function clearKeys(): void;
}
declare module "textBox" {
    import { Vector } from "math";
    import { Timer } from "timers";
    export class TextBox {
        charTimer: Timer;
        kegel: number;
        color: string;
        pos: Vector;
        size: Vector;
        charIndex: number;
        partText: string;
        texts: string[];
        partIndex: number;
        partCount: number;
        read: boolean;
        constructor(kegel?: number, color?: string);
        setPos(pos: Vector, size: Vector): void;
        newText(text: string): void;
        updateText(): void;
        draw(): void;
    }
}
declare module "dialogueBox" {
    import { TextBox } from "textBox";
    import { Vector } from "math";
    export class DialogueBox {
        textBox: TextBox;
        drawDialogueRect(): void;
        setPos(pos: Vector, size: Vector): void;
        newText(text: string): void;
        draw(): void;
        read(): boolean;
    }
}
declare module "localization" {
    export function getString(string: string): string;
}
declare module "music" {
    import { Timer } from "timers";
    export let music: {
        sound: null;
        temp: number;
        timer: Timer;
    };
}
declare module "enemies" {
    import { Vector } from "math";
    import { DialogueBox } from "dialogueBox";
    import { Heart } from "fight";
    import { Img } from "resources";
    export const ENEMY_SPARED = -1;
    export const PARAGRAPH_SYM = "~";
    export class Enemy {
        pos: Vector;
        hitpoints: number;
        maxHitpoints: number;
        damage: number;
        defence: number;
        tempDefence: number;
        tempDamage: number;
        mercy: number;
        name: string;
        description: string;
        acts: Act[];
        mercyAct: (enemies: Enemy[], activeEnemy: number, activeAct: number, heart: Heart) => void;
        mainParts: BodyPart[];
        partsDefeated: BodyPart[];
        obligatoryComments: string[];
        defaultComments: string[];
        nextComment(): string;
        killed(): boolean;
        spared(): boolean;
        defeated(): boolean;
        dialogueBox: DialogueBox;
        setNextText(): void;
        drawDialogueBox(): void;
        dialogueRead(): boolean;
        obligatoryPhrases: string[];
        defaultPhrases: string[];
        nextPhrase(): string;
        draw(pos: Vector, move?: boolean): void;
    }
    class Act {
        name: string;
        text: string;
        cons: (enemies: Enemy[], activeEnemy: number, activeAct: number, heart: Heart) => void;
        constructor(name: string, text: string, cons: (enemies: Enemy[], activeEnemy: number, activeAct: number, heart: Heart) => void);
    }
    enum Transitions {
        NONE = 0,
        LINEAR = 1,
        SINUSOIDAL = 2
    }
    class BodyPart {
        img: Img;
        point1: Vector;
        point2: Vector;
        transitionType: Transitions;
        constructor(img: Img, point1: Vector, point2: Vector, transitionType: Transitions);
        getPos(): Vector;
    }
    export class InvisibleMan extends Enemy {
        constructor();
    }
}
declare module "choiseBox" {
    import { Vector } from "math";
    export const CHOICE_RESULT_NONE = -1;
    export class Option {
        choice: string;
        color: string;
        available: boolean;
        constructor(choice: string, color: string, available: boolean);
    }
    export class ChoiseBox {
        pos: Vector;
        options: Option[];
        size: Vector;
        currentChoise: number;
        result: number;
        constructor(pos: Vector, size: Vector);
        clear(): void;
        updateChoise(heartPos: Vector): Vector;
        draw(): void;
        getHeartPos(): Vector;
    }
}
declare module "fightButton" {
    import { Vector } from "math";
    import { Img } from "resources";
    export class FightButton {
        pos: Vector;
        size: Vector;
        text: string;
        icon: Img;
        pressed: boolean;
        activated: boolean;
        constructor(pos: Vector, size: Vector, text: string, icon: Img);
        draw(): void;
        updateButton(): void;
        checkCollision(pos: Vector): void;
    }
}
declare module "hitBox" {
    import { Vector } from "math";
    export enum HitState {
        LAND_HIT = -1,
        ENDED = 0,
        PLAYING = 1
    }
    export class HitBox {
        pos: Vector;
        size: Vector;
        state: HitState;
        indicator: number;
        speed: number;
        value: number;
        hitPos: number;
        constructor(pos: Vector, size: Vector);
        clear(): void;
        updateIndicator(): void;
        draw(): void;
    }
}
declare module "healthBox" {
    import { Vector } from "math";
    import { Timer } from "timers";
    export class HealthBox {
        timer: Timer;
        ended: boolean;
        pos: Vector;
        startAmount: number;
        damage: number;
        maxAmount: number;
        width: number;
        time: number;
        playAnimation(pos: Vector, startAmount: number, damage: number, maxAmount: number, time?: number, width?: number): void;
        update(): void;
        draw(): void;
    }
}
declare module "movement" {
    import { Vector } from "math";
    export function getMovingSpeed(speed: Vector): Vector;
    export function movePlayer(pos: Vector, speed: Vector): Vector;
}
declare module "collisions" {
    import { Vector } from "math";
    export function checkRoundCollisionWithBox(pos: Vector, radius: number, speed: Vector, points: Vector[]): Vector;
}
declare module "fight" {
    import { Vector } from "math";
    import { Enemy } from "enemies";
    export const STANDART_TEXT_BOX_SIZE: Vector;
    export const STANDART_TEXT_BOX_POS: Vector;
    export const TEXT_BOX_SIZE_DIFF: Vector;
    export enum GameState {
        FIGHT = 0,
        WONDER = 1,
        MAP_EDIT = 2
    }
    export let state: GameState;
    export class Heart {
        pos: Vector;
        collisionRadius: number;
        sprite: import("resources").Img;
        damage: number;
        defence: number;
        speedConst: Vector;
        draw(): void;
    }
    export function startFight(enemies: Enemy[], phrase: string): void;
    export function loopFight(): void;
}
declare module "box" {
    import { Vector } from "math";
    export function getRectanglePoints(pos: Vector, size: Vector): Vector[];
    export class Box {
        points: Vector[];
        transitionTo: Vector[];
        transitionSpeed: number;
        moveBy(speed: Vector): Vector[];
        draw(): void;
        startTransition(to: Vector[], speed: number): void;
        updateTransition(): void;
        checkTransition(): boolean;
    }
}
declare module "wander" {
    export function loopWander(): void;
}
declare module "interactionBox" {
    import { ChoiseBox, Option } from "choiseBox";
    import { Vector } from "math";
    import { TextBox } from "textBox";
    enum InteractionType {
        TEXT = 0,
        CHOICE = 1
    }
    export class Choise {
        option: Option;
        text: string;
        cons: () => {};
        constructor(option: Option, text: string, cons: () => {});
    }
    export class Interaction {
        type: InteractionType;
        text: string;
        choises: Choise[];
        static getTextInteraction(text: string): Interaction;
        static getChoiseInteraction(choises: Choise[]): Interaction;
    }
    export class InteractionBox {
        pos: Vector;
        size: Vector;
        textBox: TextBox;
        choiseBox: ChoiseBox;
        interactions: Interaction[];
        interactionIndex: number;
        result: number;
        ended: boolean;
        constructor(pos: Vector, size: Vector);
        setInteraction(interactions: Interaction[]): void;
        setNextInteraction(): void;
        updateInteractions(heartPos: Vector): Vector;
        draw(): void;
    }
}
declare module "location" {
    import { Interaction } from "interactionBox";
    import { Vector } from "math";
    import { Img } from "resources";
    export const TILE_SIZE_GAME = 80;
    export class Tile {
        sprite: Img;
        colidable: boolean;
        script: () => void;
    }
    export class Interactable {
        sprite: Img;
        pos: Vector;
        size: Vector;
        interactions: Interaction[];
    }
    export class Location {
        tiles: Tile[];
        size: Vector;
        interactables: Interactable[];
    }
}
declare module "mapEditor" {
    export function loopEdit(): void;
}
declare module "index" { }
