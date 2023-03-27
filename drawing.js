'use strict'

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const FIGHT_IMAGE_SCALING = 3.8;

const TRANSPARENCY = 0.4;

let camera = {
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

function drawRect(x, y, width, height, angle, color, lineWidth = 0) {
    ctx.save();
    ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
    ctx.rotate(-angle);
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

function clearCanvas(color) {
    drawRect(0, 0, canvas.width, canvas.height, 0, color);
}

function drawImage(x, y, width, height, angle, image) {
    if (image instanceof AnimatedImage) {
        image = image.getImage();
    }
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
    ctx.rotate(-angle);
    ctx.scale(width / image.width, height / image.height);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
}

function drawPolygon(x, y, color, points, lineWidth = 0) {
    ctx.save();
    ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
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

function drawText(x, y, text, kegel, font, bold, color, textAlign = "center", textBaseline = "middle") {
    ctx.save();
    ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);

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

function drawParagraph(x, y, text, kegel, font, bold, color, width = 0, interval = 0, textBaseline = "middle", textAlign = "left") {
    if (width === void 0) { width = 999999; }
    if (interval === void 0) { interval = 0; }
    ctx.save();
    ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
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