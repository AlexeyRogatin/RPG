import { FIGHT_IMAGE_SCALING } from "./drawing";
import { Interaction } from "./interactionBox";
import { Vector } from "./math";
import { Img, imgNone } from "./resources";

export const TILE_SIZE_GAME = 80;

export class Tile {
    sprite: Img = imgNone;
    colidable: boolean = false;
    script: () => void = () => { };
}

export class Interactable {
    sprite: Img = imgNone;
    pos: Vector = new Vector(0, 0);
    size: Vector = new Vector(0, 0);
    interactions: Interaction[] = [];
}

export class Location {
    tiles: Tile[] = [];
    size: Vector = new Vector(0, 0);
    interactables: Interactable[] = [];
}