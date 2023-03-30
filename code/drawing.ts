import { Vector } from "math";
import { AnimatedImage } from "./resources";

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

//сплошная боль
export const FIGHT_IMAGE_SCALING = 3.8;

export const TRANSPARENCY = 0.4;

export const TEXT_KEGEL = 32;

export let camera = {
    pos: new Vector(0, 0),
    scale: 0
}

let SCREEN_RATIO = 16 / 9;

function handleResize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = 1600;
    canvas.height = 900;
    canvas.style.height = (rect.width / SCREEN_RATIO) + 'px';
}

window.addEventListener('resize', handleResize);
handleResize();

export function drawRect(x: number, y: number, width: number, height: number,
    angle: number, color: string, lineWidth = 0, transparency = 1) {
    ctx.save();
    ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
    ctx.rotate(-angle);
    ctx.globalAlpha = transparency;
    if (lineWidth === 0) {
        ctx.fillStyle = color;
        ctx.fillRect(-width / 2, -height / 2, width, height);
    } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(-width / 2, -height / 2, width, height)
    }
    ctx.restore();
}

export function clearCanvas(color: string) {
    drawRect(0, 0, canvas.width, canvas.height, 0, color);
}

export function drawImage(x: number, y: number, width: number = 0, height: number = 0, angle: number,
    image: HTMLImageElement | AnimatedImage, transparency = 1) {
    if (image instanceof AnimatedImage) {
        image = image.getImage();
    }
    if (width === 0) {
        width = image.width * FIGHT_IMAGE_SCALING;
    }
    if (height === 0) {
        height = image.height * FIGHT_IMAGE_SCALING;
    }
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
    ctx.rotate(-angle);
    ctx.scale(width / image.width, height / image.height);
    ctx.globalAlpha = transparency;
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
}

export function drawPolygon(x: number, y: number, color: string, points: Vector[], lineWidth = 0,
    transparency = 1) {
    ctx.save();
    ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
    ctx.globalAlpha = transparency;
    ctx.beginPath();
    for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
        let point = points[pointIndex];
        ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    if (lineWidth === 0) {
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke()
    }
    ctx.restore();
}

export function drawText(x: number, y: number, text: string, kegel: number, font: string, bold: boolean,
    color: string, textAlign: CanvasTextAlign = "center", textBaseline: CanvasTextBaseline = "middle",
    transparency = 1) {
    ctx.save();
    ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
    ctx.globalAlpha = transparency;
    ctx.fillStyle = color;
    let fullFont = '';
    if (bold) {
        fullFont += 'bold ';
    }
    fullFont += kegel + 'px ' + font;

    ctx.font = fullFont;
    ctx.textBaseline = textBaseline;
    ctx.textAlign = textAlign;
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

export function drawParagraph(x: number, y: number, text: string, kegel: number, font: string, bold: boolean,
    color: string, width = 0, interval = 0, textBaseline: CanvasTextBaseline = "top", textAlign: CanvasTextAlign = "left", transparency = 1) {
    if (width === void 0) { width = 999999; }
    if (interval === void 0) { interval = 0; }
    ctx.save();
    ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
    ctx.globalAlpha = transparency;
    x = 0;
    y = 0;
    ctx.fillStyle = color;
    let fullFont = '';
    if (bold) {
        fullFont += 'bold ';
    }
    fullFont += kegel + 'px ' + font;

    ctx.font = fullFont;
    ctx.textBaseline = textBaseline;
    ctx.textAlign = textAlign;
    var paragraphs = text.split('\n');
    for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {
        let paragraph = paragraphs[paragraphIndex];
        let line = '';
        let words = paragraph.split(' ');
        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            let supposedLine = line + words[wordIndex] + ' ';
            if (ctx.measureText(supposedLine).width > width) {
                ctx.fillText(line, x, y);
                y += interval;
                line = words[wordIndex] + ' ';
            }
            else {
                line = supposedLine;
            }
        }
        ctx.fillText(line, x, y);
        y += interval;
    }
    ctx.restore();
}