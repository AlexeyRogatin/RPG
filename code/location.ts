import { canvas, drawImage } from "./drawing";
import { Interaction } from "./interactionBox";
import { Vector } from "./math";
import { Img, getImage, getAnimation } from "./resources";

export const TILE_SIZE = 16;
export const SPRITE_SCALE = 5;
export const TILE_SIZE_GAME = TILE_SIZE * SPRITE_SCALE;

export class Tile {
    sprite: string = "none.bmp";
    collision: Vector = new Vector(0, 0);
    script: () => void = () => { };
}

export function getIndex(tileMap: Location, x: number, y: number) {
    return y * tileMap.size.x + x;
}

export function tilePosition(x: number, y: number) {
    let tilePos = new Vector(TILE_SIZE_GAME / 2 + x * TILE_SIZE_GAME, TILE_SIZE_GAME / 2 + y * TILE_SIZE_GAME)
        .sub(new Vector(canvas.width, canvas.height).div(2));
    return tilePos;
}

export class Interactable {
    sprite: string = "none.bmp";
    pos: Vector = new Vector(0, 0);
    size: Vector = new Vector(0, 0);
    interactions: Interaction[] = [];
}

export function drawLocation(location: Location) {
    for (let yIndex = 0; yIndex < location.size.y; yIndex++) {
        for (let xIndex = 0; xIndex < location.size.x; xIndex++) {
            let tile = location.tiles[getIndex(location, xIndex, yIndex)];
            let tilePos = tilePosition(xIndex, yIndex);
            let tileImg = getImage(tile.sprite);
            drawImage(tilePos.x, tilePos.y - (tileImg.drawHeight * SPRITE_SCALE - TILE_SIZE_GAME) / 2,
                tileImg.drawWidth * SPRITE_SCALE, tileImg.drawHeight * SPRITE_SCALE, 0, tileImg);
        }
    }
}

export class Location {
    tiles: Tile[] = [];
    size: Vector = new Vector(0, 0);
    interactables: Interactable[] = [];
}