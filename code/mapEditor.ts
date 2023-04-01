import { camera, canvas, drawImage, drawRect } from "./drawing";
import { downKey, eKey, leftKey, mouse, nKey, rightKey, upKey } from "./input";
import { Location, TILE_SIZE_GAME, Tile } from "./location";
import { Vector, clamp, isInRect } from "./math";
// import { writeFile } from "fs";

const CAMERA_SPEED = 10;

let tileMap = new Location();

function getIndex(x: number, y: number) {
    return y * tileMap.size.x + x;
}

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

function tilePosition(x: number, y: number) {
    let tilePos = new Vector(TILE_SIZE_GAME / 2 + x * TILE_SIZE_GAME, TILE_SIZE_GAME / 2 + y * TILE_SIZE_GAME)
        .sub(new Vector(canvas.width, canvas.height).div(2));
    return tilePos;
}

export function loopEdit() {
    if (nKey.wentDown) {
        tileMap.size.x = Number(prompt("Input X tile count"));
        tileMap.size.y = Number(prompt("Input Y tile count"));
        for (let yIndex = 0; yIndex < tileMap.size.y; yIndex++) {
            for (let xIndex = 0; xIndex < tileMap.size.x; xIndex++) {
                tileMap.tiles.push(new Tile());
            }
        }
    }

    if (eKey.wentDown) {
        let str = prompt("Input file name");
        // writeFile("../locations/" + str + ".json", JSON.stringify(tileMap), (err) => { alert("Отправка не удалась") });
    }

    moveCamera();

    for (let yIndex = tileMap.size.y - 1; yIndex >= 0; yIndex--) {
        for (let xIndex = 0; xIndex < tileMap.size.x; xIndex++) {
            let tile = tileMap.tiles[getIndex(xIndex, yIndex)];
            let tilePos = tilePosition(xIndex, yIndex);
            drawRect(tilePos.x, tilePos.y, TILE_SIZE_GAME, TILE_SIZE_GAME, 0, "black", 1);
            drawImage(tilePos.x, tilePos.y, TILE_SIZE_GAME, TILE_SIZE_GAME, 0, tile.sprite);
            if (isInRect(mouse.worldPos, tilePos, new Vector(TILE_SIZE_GAME, TILE_SIZE_GAME))) {
                drawRect(tilePos.x, tilePos.y, TILE_SIZE_GAME, TILE_SIZE_GAME, 0, "green", 5);
            }
        }
    }
}