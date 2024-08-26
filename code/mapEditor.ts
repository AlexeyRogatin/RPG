import { camera, canvas, drawImage, drawRect } from "./drawing";
import { cKey, downKey, eKey, iKey, leftKey, mouse, nKey, rightKey, upKey } from "./input";
import { Location, SPRITE_SCALE, TILE_SIZE_GAME, Tile, getIndex, tilePosition } from "./location";
import { Vector, clamp, isInRect } from "./math";
import { getImage } from "./resources";

const CAMERA_SPEED = 10;

let tileMap = new Location();

function moveCamera() {
    camera.pos.x += (Number(rightKey.isDown) - Number(leftKey.isDown)) * CAMERA_SPEED;
    camera.pos.y += (Number(downKey.isDown) - Number(upKey.isDown)) * CAMERA_SPEED;
    let firstTile = tilePosition(0, 0);
    let lastTile = tilePosition(tileMap.size.x - 1, tileMap.size.y - 1);
    camera.pos.x = clamp(camera.pos.x, firstTile.x + canvas.width / 2 - TILE_SIZE_GAME / 2,
        lastTile.x - canvas.width / 2 + TILE_SIZE_GAME / 2);
    camera.pos.y = clamp(camera.pos.y, firstTile.y + canvas.height / 2 - TILE_SIZE_GAME / 2,
        lastTile.y - canvas.height / 2 + TILE_SIZE_GAME / 2);
}

function makeTextFile(text: string) {
    var data = new Blob([text], { type: 'text/plain' });

    let textFile = window.URL.createObjectURL(data);

    return textFile;
};

enum EditMode {
    TILES,
    COLLISION,
    INTERACTABLES
};

let editMode = EditMode.TILES;

let image: string = "";

let collisionSize = new Vector(0, 0);

export function loopEdit() {
    //press N to make a new map
    if (nKey.wentDown) {
        tileMap.size.x = Number(prompt("Input X tile count"));
        tileMap.size.y = Number(prompt("Input Y tile count"));
        for (let yIndex = 0; yIndex < tileMap.size.y; yIndex++) {
            for (let xIndex = 0; xIndex < tileMap.size.x; xIndex++) {
                tileMap.tiles.push(new Tile());
            }
        }
    }

    //press E to get a JSON file
    if (eKey.wentDown) {
        let string = JSON.stringify(tileMap);
        alert(makeTextFile(string));
    }

    //press I to choose an image
    if (iKey.wentDown) {
        image = String(prompt("Введите код изображения"));
        editMode = EditMode.TILES;
    }

    //press C to make collisions
    if (cKey.wentDown) {
        collisionSize.x = Number(prompt("Input collision size X in tiles"));
        collisionSize.y = Number(prompt("Input collision size Y in tiles"));

        editMode = EditMode.COLLISION;
    }

    //move camera with arrows
    moveCamera();

    //left click to interact with tile
    if (mouse.isDown) {
        let pos = mouse.worldPos.add(new Vector(canvas.width, canvas.height).div(2)).div(TILE_SIZE_GAME).floor();
        let index = getIndex(tileMap, pos.x, pos.y);
        if (index >= 0 && index <= tileMap.size.x * tileMap.size.y) {
            switch (editMode) {
                case EditMode.TILES: {
                    tileMap.tiles[index].sprite = image;
                } break;
                case EditMode.COLLISION: {
                    tileMap.tiles[index].collision = collisionSize.mul(TILE_SIZE_GAME);
                }
            }
        }
    }

    for (let yIndex = 0; yIndex < tileMap.size.y; yIndex++) {
        for (let xIndex = 0; xIndex < tileMap.size.x; xIndex++) {
            let tile = tileMap.tiles[getIndex(tileMap, xIndex, yIndex)];
            let tilePos = tilePosition(xIndex, yIndex);
            drawRect(tilePos.x, tilePos.y, TILE_SIZE_GAME, TILE_SIZE_GAME, 0, "black", 1);

            let tileImg = getImage(tile.sprite);
            drawImage(tilePos.x, tilePos.y - (tileImg.drawHeight * SPRITE_SCALE - TILE_SIZE_GAME) / 2,
                tileImg.drawWidth * SPRITE_SCALE, tileImg.drawHeight * SPRITE_SCALE, 0, tileImg);

            if (isInRect(mouse.worldPos, tilePos, new Vector(TILE_SIZE_GAME, TILE_SIZE_GAME))) {
                drawRect(tilePos.x, tilePos.y, TILE_SIZE_GAME, TILE_SIZE_GAME, 0, "green", 5);
            }
            if (tile.collision.length() > 0) {
                drawRect(tilePos.x, tilePos.y, tile.collision.x, tile.collision.y, 0, "purple", 5);
            }
        }
    }
}