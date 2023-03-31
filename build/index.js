System.register("math", [], function (exports_1, context_1) {
    "use strict";
    var Vector;
    var __moduleName = context_1 && context_1.id;
    function clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }
    exports_1("clamp", clamp);
    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    exports_1("getRandomFloat", getRandomFloat);
    function getRandomInt(min, max) {
        return Math.floor(getRandomFloat(min, max + 0.999));
    }
    exports_1("getRandomInt", getRandomInt);
    function isInRect(pos, rectPos, size) {
        return !(pos.x > rectPos.x + size.x / 2 ||
            pos.x < rectPos.x - size.x / 2 ||
            pos.y > rectPos.y + size.y / 2 ||
            pos.y < rectPos.y - size.y / 2);
    }
    exports_1("isInRect", isInRect);
    return {
        setters: [],
        execute: function () {
            Vector = class Vector {
                constructor(x, y, z = 0) {
                    this.x = x;
                    this.y = y;
                    this.z = z;
                }
                toXY() {
                    return this.x, this.y;
                }
                dot(vec) {
                    return (this.x * vec.x + this.y * vec.y + this.z * vec.z);
                }
                length() {
                    return Math.sqrt(this.dot(this));
                }
                cross(vec) {
                    return new Vector(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x);
                }
                unit() {
                    return this.div(this.length());
                }
                add(b) {
                    return new Vector(this.x + b.x, this.y + b.y, this.z + b.z);
                }
                sub(b) {
                    return new Vector(this.x - b.x, this.y - b.y, this.z - b.z);
                }
                mul(c) {
                    return new Vector(this.x * c, this.y * c, this.z * c);
                }
                div(c) {
                    return new Vector(this.x / c, this.y / c, this.z / c);
                }
            };
            exports_1("Vector", Vector);
        }
    };
});
System.register("timers", [], function (exports_2, context_2) {
    "use strict";
    var Timer;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Timer = class Timer {
                constructor(time) {
                    this.time = -1;
                    this.time = time;
                    Timer.timers.push(this);
                }
                static updateTimers() {
                    for (let index = 0; index < this.timers.length; index++) {
                        this.timers[index].time--;
                    }
                }
                setTime(time) {
                    this.time = time;
                }
                getTime() {
                    return this.time;
                }
                timeExpired() {
                    return this.time <= 0;
                }
            };
            exports_2("Timer", Timer);
            Timer.timers = [];
        }
    };
});
System.register("resources", ["timers", "math"], function (exports_3, context_3) {
    "use strict";
    var timers_1, math_1, Img, AnimatedImg, imgNone, imgHeart, imgFight, imgAct, imgItem, imgMercy, imgDialogueBox, imgDialogueBoxCorner, imgDialogueBoxTail, imgInvisibleManBoots, imgInvisibleManTrench, imgInvisibleManHead, imgInvisibleManDefeat, animHit, imgLexa, imgLexaBack, imgLexaSideRight, imgLexaSideLeft, animLexaWalk, animLexaWalkBack, animLexaWalkSideRight, animLexaWalkSideLeft;
    var __moduleName = context_3 && context_3.id;
    function loadImage(src) {
        let img = new Image();
        img.src = src;
        return img;
    }
    function loadImageFromData(src, inverted = new math_1.Vector(0, 0)) {
        src = "../data/" + src;
        let img = loadImage(src);
        return img;
    }
    return {
        setters: [
            function (timers_1_1) {
                timers_1 = timers_1_1;
            },
            function (math_1_1) {
                math_1 = math_1_1;
            }
        ],
        execute: function () {
            Img = class Img {
                constructor(src, invertedX = false, invertedY = false) {
                    this.img = loadImageFromData(src);
                    this.width = this.img.width;
                    this.height = this.img.height;
                    this.drawWidth = this.img.width;
                    this.drawHeight = this.img.height;
                    if (invertedX) {
                        this.drawWidth *= -1;
                    }
                    if (invertedY) {
                        this.drawHeight *= -1;
                    }
                }
                updateImage() {
                }
            };
            exports_3("Img", Img);
            AnimatedImg = class AnimatedImg extends Img {
                constructor(invertedX = false, invertedY = false, ...args) {
                    super("none.bmp", invertedX, invertedY);
                    this.images = [];
                    this.changeTimer = new timers_1.Timer(0);
                    this.playing = false;
                    this.delay = 0;
                    this.looped = false;
                    for (let imageIndex = 2; imageIndex < arguments.length; imageIndex++) {
                        this.images.push(new Img(arguments[imageIndex], invertedX, invertedY));
                    }
                }
                startAnimation(delay, looped) {
                    this.changeTimer.setTime(delay * this.images.length - 1);
                    this.delay = delay;
                    this.looped = looped;
                    this.playing = true;
                }
                changeDelay(delay) {
                    let progress = Math.floor(this.changeTimer.getTime() / this.delay * delay);
                    this.changeTimer.setTime(progress);
                    this.delay = delay;
                }
                updateImage() {
                    if (this.changeTimer.getTime() < 0) {
                        if (this.looped) {
                            this.changeTimer.setTime(this.delay * this.images.length - 1);
                        }
                        else {
                            this.playing = false;
                        }
                    }
                    let img = imgNone;
                    if (this.playing) {
                        img = this.images[this.images.length - 1 - Math.floor(this.changeTimer.getTime() / this.delay)];
                    }
                    this.img = img.img;
                    this.width = img.width;
                    this.height = img.height;
                    this.drawWidth = img.drawWidth;
                    this.drawHeight = img.drawHeight;
                }
            };
            exports_3("AnimatedImg", AnimatedImg);
            exports_3("imgNone", imgNone = new Img("none.bmp"));
            exports_3("imgHeart", imgHeart = new Img("heart.bmp"));
            exports_3("imgFight", imgFight = new Img("fightIcon.bmp"));
            exports_3("imgAct", imgAct = new Img("actIcon.bmp"));
            exports_3("imgItem", imgItem = new Img("itemIcon.bmp"));
            exports_3("imgMercy", imgMercy = new Img("mercyIcon.bmp"));
            exports_3("imgDialogueBox", imgDialogueBox = new Img("dialogueBox.bmp"));
            exports_3("imgDialogueBoxCorner", imgDialogueBoxCorner = new Img("dialogueBoxCorner.bmp"));
            exports_3("imgDialogueBoxTail", imgDialogueBoxTail = new Img("dialogueBoxTail.bmp"));
            exports_3("imgInvisibleManBoots", imgInvisibleManBoots = new Img("invisibleManBoots.bmp"));
            exports_3("imgInvisibleManTrench", imgInvisibleManTrench = new Img("invisibleManCoat.bmp"));
            exports_3("imgInvisibleManHead", imgInvisibleManHead = new Img("invisibleManHead.bmp"));
            exports_3("imgInvisibleManDefeat", imgInvisibleManDefeat = new Img("invisibleManDefeat.bmp"));
            exports_3("animHit", animHit = new AnimatedImg(false, false, "hit1.bmp", "hit2.bmp", "hit3.bmp", "hit4.bmp", "hit5.bmp", "hit6.bmp", "hit7.bmp"));
            exports_3("imgLexa", imgLexa = new Img("lexaIdle.bmp"));
            exports_3("imgLexaBack", imgLexaBack = new Img("lexaBack.bmp"));
            exports_3("imgLexaSideRight", imgLexaSideRight = new Img("lexaSide.bmp"));
            exports_3("imgLexaSideLeft", imgLexaSideLeft = new Img("lexaSide.bmp", true));
            exports_3("animLexaWalk", animLexaWalk = new AnimatedImg(false, false, "lexaWalk1.bmp", "lexaIdle.bmp", "lexaWalk2.bmp", "lexaIdle.bmp"));
            exports_3("animLexaWalkBack", animLexaWalkBack = new AnimatedImg(false, false, "lexaBackWalk1.bmp", "lexaBack.bmp", "lexaBackWalk2.bmp", "lexaBack.bmp"));
            ;
            exports_3("animLexaWalkSideRight", animLexaWalkSideRight = new AnimatedImg(false, false, "lexaSideWalk1.bmp", "lexaSide.bmp", "lexaSideWalk2.bmp", "lexaSide.bmp"));
            exports_3("animLexaWalkSideLeft", animLexaWalkSideLeft = new AnimatedImg(true, false, "lexaSideWalk1.bmp", "lexaSide.bmp", "lexaSideWalk2.bmp", "lexaSide.bmp"));
        }
    };
});
System.register("drawing", ["math"], function (exports_4, context_4) {
    "use strict";
    var math_2, canvas, ctx, FIGHT_IMAGE_SCALING, TRANSPARENCY, TEXT_KEGEL, camera, SCREEN_RATIO;
    var __moduleName = context_4 && context_4.id;
    function handleResize() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = 1600;
        canvas.height = 900;
        canvas.style.height = (rect.width / SCREEN_RATIO) + 'px';
    }
    function drawRect(x, y, width, height, angle, color, lineWidth = 0, transparency = 1) {
        ctx.save();
        ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
        ctx.rotate(-angle);
        ctx.globalAlpha = transparency;
        if (lineWidth === 0) {
            ctx.fillStyle = color;
            ctx.fillRect(-width / 2, -height / 2, width, height);
        }
        else {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.strokeRect(-width / 2, -height / 2, width, height);
        }
        ctx.restore();
    }
    exports_4("drawRect", drawRect);
    function clearCanvas(color) {
        drawRect(camera.pos.x, camera.pos.y, canvas.width, canvas.height, 0, color);
    }
    exports_4("clearCanvas", clearCanvas);
    function drawImage(x, y, width = 0, height = 0, angle, image, transparency = 1) {
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
        ctx.scale(width / image.drawWidth, height / image.drawHeight);
        ctx.globalAlpha = transparency;
        image.updateImage();
        ctx.drawImage(image.img, -image.width / 2, -image.height / 2);
        ctx.restore();
    }
    exports_4("drawImage", drawImage);
    function drawPolygon(x, y, color, points, lineWidth = 0, transparency = 1) {
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
        }
        else {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
        ctx.restore();
    }
    exports_4("drawPolygon", drawPolygon);
    function textParams(kegel, font, bold, textAlign, textBaseline, transparency) {
        ctx.globalAlpha = transparency;
        let fullFont = '';
        if (bold) {
            fullFont += 'bold ';
        }
        fullFont += kegel + 'px ' + font;
        ctx.font = fullFont;
        ctx.textBaseline = textBaseline;
        ctx.textAlign = textAlign;
    }
    function drawOnlyText(x, y, text, color, lineWidth) {
        if (lineWidth !== 0) {
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.strokeText(text, x, y);
        }
        else {
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
        }
    }
    function drawText(x, y, text, kegel, font, bold, color, textAlign = "center", textBaseline = "middle", transparency = 1, lineWidth = 0) {
        ctx.save();
        ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
        textParams(kegel, font, bold, textAlign, textBaseline, transparency);
        drawOnlyText(0, 0, text, color, lineWidth);
        ctx.restore();
    }
    exports_4("drawText", drawText);
    function drawParagraph(x, y, text, kegel, font, bold, color, width = 0, interval = 0, textBaseline = "top", textAlign = "left", transparency = 1, lineWidth = 0) {
        if (width === void 0) {
            width = 999999;
        }
        if (interval === void 0) {
            interval = 0;
        }
        ctx.save();
        ctx.translate(x - camera.pos.x + canvas.width / 2, y - camera.pos.y + canvas.height / 2);
        x = 0;
        y = 0;
        textParams(kegel, font, bold, textAlign, textBaseline, transparency);
        var paragraphs = text.split('\n');
        for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {
            let paragraph = paragraphs[paragraphIndex];
            let line = '';
            let words = paragraph.split(' ');
            for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                let supposedLine = line + words[wordIndex] + ' ';
                if (ctx.measureText(supposedLine).width > width) {
                    drawOnlyText(x, y, line, color, lineWidth);
                    y += interval;
                    line = words[wordIndex] + ' ';
                }
                else {
                    line = supposedLine;
                }
            }
            drawOnlyText(x, y, line, color, lineWidth);
            y += interval;
        }
        ctx.restore();
    }
    exports_4("drawParagraph", drawParagraph);
    return {
        setters: [
            function (math_2_1) {
                math_2 = math_2_1;
            }
        ],
        execute: function () {
            exports_4("canvas", canvas = document.getElementById("canvas"));
            ctx = canvas.getContext("2d");
            exports_4("FIGHT_IMAGE_SCALING", FIGHT_IMAGE_SCALING = 3.8);
            exports_4("TRANSPARENCY", TRANSPARENCY = 0.4);
            exports_4("TEXT_KEGEL", TEXT_KEGEL = 32);
            exports_4("camera", camera = {
                pos: new math_2.Vector(0, 0),
                scale: 0
            });
            SCREEN_RATIO = 16 / 9;
            window.addEventListener('resize', handleResize);
            handleResize();
        }
    };
});
System.register("input", ["drawing"], function (exports_5, context_5) {
    "use strict";
    var drawing_1, Key, keyCodes, upKey, downKey, leftKey, rightKey, zKey, xKey, enterKey;
    var __moduleName = context_5 && context_5.id;
    function handleKeyDown(key) {
        if (!key.isDown) {
            key.wentDown = true;
            key.isDown = true;
        }
    }
    function handleKeyUp(key) {
        if (key.isDown) {
            key.wentUp = true;
            key.isDown = false;
        }
    }
    function clearKey(key) {
        key.wentDown = false;
        key.wentUp = false;
    }
    function clearKeys() {
        for (let keyIndex = 0; keyIndex < Key.keys.length; keyIndex++) {
            clearKey(Key.keys[keyIndex]);
        }
    }
    exports_5("clearKeys", clearKeys);
    return {
        setters: [
            function (drawing_1_1) {
                drawing_1 = drawing_1_1;
            }
        ],
        execute: function () {
            Key = class Key {
                constructor(keyCode) {
                    this.isDown = false;
                    this.wentDown = false;
                    this.wentUp = false;
                    this.keyCode = keyCode;
                    Key.keys.push(this);
                }
            };
            Key.keys = [];
            (function (keyCodes) {
                keyCodes[keyCodes["UP"] = 38] = "UP";
                keyCodes[keyCodes["DOWN"] = 40] = "DOWN";
                keyCodes[keyCodes["LEFT"] = 37] = "LEFT";
                keyCodes[keyCodes["RIGHT"] = 39] = "RIGHT";
                keyCodes[keyCodes["Z"] = 90] = "Z";
                keyCodes[keyCodes["X"] = 88] = "X";
                keyCodes[keyCodes["ENTER"] = 13] = "ENTER";
            })(keyCodes || (keyCodes = {}));
            exports_5("upKey", upKey = new Key(keyCodes.UP));
            exports_5("downKey", downKey = new Key(keyCodes.DOWN));
            exports_5("leftKey", leftKey = new Key(keyCodes.LEFT));
            exports_5("rightKey", rightKey = new Key(keyCodes.RIGHT));
            exports_5("zKey", zKey = new Key(keyCodes.Z));
            exports_5("xKey", xKey = new Key(keyCodes.X));
            exports_5("enterKey", enterKey = new Key(keyCodes.ENTER));
            window.onkeydown = function onkeydown(event) {
                for (let keyIndex = 0; keyIndex < Key.keys.length; keyIndex++) {
                    if (event.keyCode === Key.keys[keyIndex].keyCode) {
                        handleKeyDown(Key.keys[keyIndex]);
                    }
                }
            };
            window.onkeyup = function onkeyup(event) {
                for (let keyIndex = 0; keyIndex < Key.keys.length; keyIndex++) {
                    if (event.keyCode === Key.keys[keyIndex].keyCode) {
                        handleKeyUp(Key.keys[keyIndex]);
                    }
                }
            };
            document.addEventListener("mousedown", function mouseDown(event) {
                drawing_1.canvas.requestFullscreen();
                drawing_1.canvas.requestPointerLock();
            });
        }
    };
});
System.register("textBox", ["drawing", "math", "enemies", "input", "timers"], function (exports_6, context_6) {
    "use strict";
    var drawing_2, math_3, drawing_3, enemies_1, input_1, timers_2, CHAR_PAUSE, WORD_PAUSE, PARAGRAPH_PAUSE, TextBox;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (drawing_2_1) {
                drawing_2 = drawing_2_1;
                drawing_3 = drawing_2_1;
            },
            function (math_3_1) {
                math_3 = math_3_1;
            },
            function (enemies_1_1) {
                enemies_1 = enemies_1_1;
            },
            function (input_1_1) {
                input_1 = input_1_1;
            },
            function (timers_2_1) {
                timers_2 = timers_2_1;
            }
        ],
        execute: function () {
            CHAR_PAUSE = 2;
            WORD_PAUSE = 3;
            PARAGRAPH_PAUSE = 15;
            TextBox = class TextBox {
                constructor(kegel = drawing_2.TEXT_KEGEL, color = "white") {
                    this.charTimer = new timers_2.Timer(0);
                    this.pos = new math_3.Vector(0, 0);
                    this.size = new math_3.Vector(0, 0);
                    this.charIndex = 0;
                    this.partText = "";
                    this.texts = [];
                    this.partIndex = 0;
                    this.partCount = 0;
                    this.read = false;
                    this.kegel = kegel;
                    this.color = color;
                }
                setPos(pos, size) {
                    this.pos = pos;
                    this.size = size;
                }
                newText(text) {
                    this.charIndex = 0;
                    this.partText = "";
                    this.texts = text.split(enemies_1.PARAGRAPH_SYM);
                    this.partIndex = 0;
                    this.partCount = (text.split(enemies_1.PARAGRAPH_SYM)).length;
                    this.read = false;
                }
                updateText() {
                    if (input_1.xKey.wentDown) {
                        this.charIndex = this.texts[this.partIndex].length;
                        this.partText = this.texts[this.partIndex];
                    }
                    if (this.charIndex === this.texts[this.partIndex].length) {
                        if (input_1.zKey.wentDown) {
                            if (this.partIndex + 1 === this.partCount) {
                                this.read = true;
                            }
                            else {
                                this.partText = "";
                                this.charIndex = 0;
                                this.partIndex = math_3.clamp(this.partIndex + 1, 0, this.partCount - 1);
                            }
                        }
                    }
                    else if (this.charTimer.getTime() <= 0) {
                        this.partText += this.texts[this.partIndex][this.charIndex];
                        this.charIndex++;
                        let time = CHAR_PAUSE;
                        switch (this.texts[this.partIndex][this.charIndex]) {
                            case ' ':
                                {
                                    time = WORD_PAUSE;
                                }
                                break;
                            case '\n':
                                {
                                    time = PARAGRAPH_PAUSE;
                                }
                                break;
                        }
                        this.charTimer.setTime(time);
                    }
                }
                draw() {
                    drawing_3.drawParagraph(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, this.partText, this.kegel, "Big", false, this.color, this.size.x, this.kegel * 1.5);
                }
            };
            exports_6("TextBox", TextBox);
        }
    };
});
System.register("dialogueBox", ["resources", "drawing", "textBox"], function (exports_7, context_7) {
    "use strict";
    var resources_1, drawing_4, textBox_1, DIALOGUE_BOX_KEGEL, DIALOGUE_FONT_COLOR, DIALOGUE_BOX_COLOR, DIALOGUE_BOX_BORDER, DIALOGUE_BOX_TAIL, DialogueBox;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (resources_1_1) {
                resources_1 = resources_1_1;
            },
            function (drawing_4_1) {
                drawing_4 = drawing_4_1;
            },
            function (textBox_1_1) {
                textBox_1 = textBox_1_1;
            }
        ],
        execute: function () {
            DIALOGUE_BOX_KEGEL = 20;
            DIALOGUE_FONT_COLOR = "black";
            DIALOGUE_BOX_COLOR = "white";
            DIALOGUE_BOX_BORDER = resources_1.imgDialogueBoxCorner.width * drawing_4.FIGHT_IMAGE_SCALING;
            DIALOGUE_BOX_TAIL = resources_1.imgDialogueBoxTail.width * drawing_4.FIGHT_IMAGE_SCALING;
            DialogueBox = class DialogueBox {
                constructor() {
                    this.textBox = new textBox_1.TextBox(DIALOGUE_BOX_KEGEL, DIALOGUE_FONT_COLOR);
                }
                drawDialogueRect() {
                    drawing_4.drawImage(this.textBox.pos.x - (this.textBox.size.x + DIALOGUE_BOX_BORDER) / 2, this.textBox.pos.y - (this.textBox.size.y + DIALOGUE_BOX_BORDER) / 2, DIALOGUE_BOX_BORDER + 2, DIALOGUE_BOX_BORDER + 2, 0, resources_1.imgDialogueBoxCorner);
                    drawing_4.drawImage(this.textBox.pos.x - (this.textBox.size.x + DIALOGUE_BOX_BORDER) / 2, this.textBox.pos.y + (this.textBox.size.y + DIALOGUE_BOX_BORDER) / 2, DIALOGUE_BOX_BORDER + 2, DIALOGUE_BOX_BORDER + 2, Math.PI / 2, resources_1.imgDialogueBoxCorner);
                    drawing_4.drawImage(this.textBox.pos.x + (this.textBox.size.x + DIALOGUE_BOX_BORDER) / 2, this.textBox.pos.y + (this.textBox.size.y + DIALOGUE_BOX_BORDER) / 2, DIALOGUE_BOX_BORDER + 2, DIALOGUE_BOX_BORDER + 2, Math.PI, resources_1.imgDialogueBoxCorner);
                    drawing_4.drawImage(this.textBox.pos.x + (this.textBox.size.x + DIALOGUE_BOX_BORDER) / 2, this.textBox.pos.y - (this.textBox.size.y + DIALOGUE_BOX_BORDER) / 2, DIALOGUE_BOX_BORDER + 2, DIALOGUE_BOX_BORDER + 2, Math.PI * 3 / 2, resources_1.imgDialogueBoxCorner);
                    drawing_4.drawImage(this.textBox.pos.x - (this.textBox.size.x + DIALOGUE_BOX_TAIL) / 2 - DIALOGUE_BOX_BORDER, this.textBox.pos.y - (this.textBox.size.y - DIALOGUE_BOX_TAIL) / 2, DIALOGUE_BOX_BORDER + 2, DIALOGUE_BOX_BORDER + 2, 0, resources_1.imgDialogueBoxTail);
                    drawing_4.drawRect(this.textBox.pos.x, this.textBox.pos.y, this.textBox.size.x + 2, this.textBox.size.y + DIALOGUE_BOX_BORDER * 2 + 2, 0, DIALOGUE_BOX_COLOR);
                    drawing_4.drawRect(this.textBox.pos.x, this.textBox.pos.y, this.textBox.size.x + DIALOGUE_BOX_BORDER * 2 + 2, this.textBox.size.y + 2, 0, DIALOGUE_BOX_COLOR);
                }
                setPos(pos, size) {
                    this.textBox.setPos(pos, size);
                }
                newText(text) {
                    this.textBox.newText(text);
                }
                draw() {
                    this.textBox.updateText();
                    this.drawDialogueRect();
                    this.textBox.draw();
                }
                read() {
                    return this.textBox.read;
                }
            };
            exports_7("DialogueBox", DialogueBox);
        }
    };
});
System.register("localization", [], function (exports_8, context_8) {
    "use strict";
    var LOCAL_ENGLISH, LOCAL_RUSSIAN, local, englishLocalization, russianLocalization;
    var __moduleName = context_8 && context_8.id;
    function getString(string) {
        switch (local) {
            case LOCAL_ENGLISH: {
                return englishLocalization[string];
            }
            case LOCAL_RUSSIAN: {
                return russianLocalization[string];
            }
            default: {
                return "";
            }
        }
    }
    exports_8("getString", getString);
    return {
        setters: [],
        execute: function () {
            LOCAL_ENGLISH = 0;
            LOCAL_RUSSIAN = 1;
            local = LOCAL_ENGLISH;
            englishLocalization = {
                "fight.interface.won": "You won!",
                "fight.interface.fight": "Fight",
                "fight.interface.action": "Act",
                "fight.interface.item": "Item",
                "fight.interface.mercy": "Mercy",
                "fight.interface.dmg": "DMG",
                "fight.interface.def": "DEF",
                "action.check": "Check",
                "enemy.invisibleman": "Invisible man",
                "enemy.invisibleman.action.check.result": "Tries to be reserved, but failes because of his outfit.",
                "enemy.invisibleman.action.confuse": "Confuse",
                "enemy.invisibleman.action.confuse.result": "You tried to confuse the Invisible man, but he didn't reacted~Looks \
like you are the one being confused.\nHis defence increased.",
                "enemy.invisibleman.action.threaten": "Threaten",
                "enemy.invisibleman.action.threaten.result": "You said the Invisible man that you can see right through him, ~he seems scared.",
                "enemy.invisibleman.action.ignore": "Ignore",
                "enemy.invisibleman.action.ignore.result": "You turned your face from the Invisible man and he disapeared!~His attack this turn increased.",
                "enemy.invisibleman.comments.random.1": "The Invisible man looks like he is hiding something.",
                "enemy.invisibleman.comments.random.2": "The Invisible man paranoidly looks around.",
                "enemy.invisibleman.comments.random.3": "You feel the Invisible man's gaze.",
                "enemy.invisibleman.comments.random.4": "The Invisible man is smiling at you... I guess?",
                "enemy.invisibleman.phrases.random.1": "You can't see me",
                "enemy.invisibleman.phrases.random.2": "You didn't see me",
                "enemy.invisibleman.phrases.random.3": "You won't see me",
                "enemy.invisibleman.phrases.random.4": "You haven't seen me for years",
                "enemy.invisibleman.phrases.random.5": "You hadn't seen me after you saw me",
                "enemy.invisibleman.phrases.random.6": "You wouldn't see me",
                "enemy.invisibleman.comments.reaction.threaten": "The Invisible man wants to go home.",
                "enemy.invisibleman.phrases.reaction.threaten": "What?! I have nothing to hide!...",
                "fight.start.enemy.invisibleman": "Such a mischief!",
            };
            russianLocalization = {
                "fight.interface.won": "Вы победили!",
                "fight.interface.fight": "Удар",
                "fight.interface.action": "Дейст",
                "fight.interface.item": "Вещь",
                "fight.interface.mercy": "Пощад",
                "fight.interface.dmg": "АТК",
                "fight.interface.def": "ЗЩТ",
                "action.check": "Проверка",
                "enemy.invisibleman": "Человек-невидимка",
                "enemy.invisibleman.action.check.result": "Пытается скрываться, но его прикид вызывает подозрения.",
                "enemy.invisibleman.action.confuse": "Запутать",
                "enemy.invisibleman.action.confuse.result": "Вы попытались запутать Человека-невидимку, но он не обратил внимания~Кажется, Вы запутались сами.\nЕго защита увеличена",
                "enemy.invisibleman.action.threaten": "Угрожать",
                "enemy.invisibleman.action.threaten.result": "Вы сказали Человеку-невидимке, что Вы видите его насквозь,~он выглядит напуганным.",
                "enemy.invisibleman.action.ignore": "Игнорировать",
                "enemy.invisibleman.action.ignore.result": "Вы отвернулись от Человека-невидимки и он исчез!~Сила его следующей атаки увеличина.",
                "enemy.invisibleman.comments.random.1": "Кажется, Человек-невидимка что-то прячет.",
                "enemy.invisibleman.comments.random.2": "Человек-невидимка пароноидально осматривает местность.",
                "enemy.invisibleman.comments.random.3": "Вы ощущаете пристальный взгляд Человека-невидимки",
                "enemy.invisibleman.comments.random.4": "Человек-невидимка улыбается Вам... Наверное?...",
                "enemy.invisibleman.phrases.random.1": "Ты меня не видишь",
                "enemy.invisibleman.phrases.random.2": "Ты меня не видел",
                "enemy.invisibleman.phrases.random.3": "Ты меня не увидишь",
                "enemy.invisibleman.phrases.random.4": "Ты не видел меня уже долгое время",
                "enemy.invisibleman.phrases.random.5": "Ты меня не увидел, после того как ты меня увидел",
                "enemy.invisibleman.phrases.random.6": "Ты меня не увидел бы",
                "enemy.invisibleman.comments.reaction.threaten": "Невидимый человек хочет обратно к маме.",
                "enemy.invisibleman.phrases.reaction.threaten": "Чего?! Мне нечего прятать!...",
                "fight.start.enemy.invisibleman": "Какая оказия!",
            };
        }
    };
});
System.register("music", ["timers"], function (exports_9, context_9) {
    "use strict";
    var timers_3, music;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (timers_3_1) {
                timers_3 = timers_3_1;
            }
        ],
        execute: function () {
            exports_9("music", music = {
                sound: null,
                temp: 180,
                timer: new timers_3.Timer(0),
            });
        }
    };
});
System.register("enemies", ["math", "dialogueBox", "drawing", "localization", "resources", "music"], function (exports_10, context_10) {
    "use strict";
    var math_4, math_5, dialogueBox_1, drawing_5, localization_1, resources_2, music_1, ENEMY_SPARED, DIALOGUE_BOX_OFFSET, DIALOGUE_BOX_SIZE, PARAGRAPH_SYM, Enemy, emptyFunction, Act, Transitions, BodyPart, InvisibleMan;
    var __moduleName = context_10 && context_10.id;
    function checkText(enemies, activeEnemy, activeAct, heart) {
        enemies[activeEnemy].acts[activeAct].text = enemies[activeEnemy].name + "\n" + localization_1.getString("fight.interface.dmg") + " " +
            (enemies[activeEnemy].damage - enemies[activeEnemy].tempDamage) + " " + localization_1.getString("fight.interface.def") + " " +
            (enemies[activeEnemy].defence - enemies[activeEnemy].tempDefence) + "\n" +
            enemies[activeEnemy].description;
    }
    return {
        setters: [
            function (math_4_1) {
                math_4 = math_4_1;
                math_5 = math_4_1;
            },
            function (dialogueBox_1_1) {
                dialogueBox_1 = dialogueBox_1_1;
            },
            function (drawing_5_1) {
                drawing_5 = drawing_5_1;
            },
            function (localization_1_1) {
                localization_1 = localization_1_1;
            },
            function (resources_2_1) {
                resources_2 = resources_2_1;
            },
            function (music_1_1) {
                music_1 = music_1_1;
            }
        ],
        execute: function () {
            exports_10("ENEMY_SPARED", ENEMY_SPARED = -1);
            DIALOGUE_BOX_OFFSET = new math_4.Vector(200, 0);
            DIALOGUE_BOX_SIZE = new math_4.Vector(140, 140);
            exports_10("PARAGRAPH_SYM", PARAGRAPH_SYM = "~");
            Enemy = class Enemy {
                constructor() {
                    this.pos = new math_4.Vector(0, 0);
                    this.hitpoints = 0;
                    this.maxHitpoints = 0;
                    this.damage = 0;
                    this.defence = 0;
                    this.tempDefence = 0;
                    this.tempDamage = 0;
                    this.mercy = 0;
                    this.name = "";
                    this.description = "";
                    this.acts = [new Act(localization_1.getString("action.check"), "", checkText)];
                    this.mercyAct = emptyFunction;
                    this.mainParts = [];
                    this.partsDefeated = [];
                    this.obligatoryComments = [];
                    this.defaultComments = [];
                    this.dialogueBox = new dialogueBox_1.DialogueBox();
                    this.obligatoryPhrases = [];
                    this.defaultPhrases = [];
                }
                nextComment() {
                    let str = this.obligatoryComments.shift();
                    if (str === undefined) {
                        str = this.defaultComments[math_5.getRandomInt(0, this.defaultComments.length - 1)];
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
                nextPhrase() {
                    let str = this.obligatoryPhrases.shift();
                    if (str === undefined) {
                        str = this.defaultPhrases[math_5.getRandomInt(0, this.defaultPhrases.length - 1)];
                    }
                    return str;
                }
                draw(pos, move = true) {
                    let bodyParts = this.mainParts;
                    if (this.hitpoints <= 0) {
                        bodyParts = this.partsDefeated;
                    }
                    let alpha = 1;
                    if (this.mercy === ENEMY_SPARED) {
                        alpha = drawing_5.TRANSPARENCY;
                        move = false;
                    }
                    for (let partIndex = 0; partIndex < bodyParts.length; partIndex++) {
                        let part = bodyParts[partIndex];
                        let partPos;
                        if (move) {
                            partPos = part.getPos();
                        }
                        else {
                            partPos = part.point1;
                        }
                        drawing_5.drawImage(pos.x + partPos.x, pos.y + partPos.y, 0, 0, 0, part.img, alpha);
                    }
                }
            };
            exports_10("Enemy", Enemy);
            emptyFunction = (enemies, activeEnemy, activeAct, heart) => { };
            Act = class Act {
                constructor(name, text, cons) {
                    this.name = name;
                    this.text = text;
                    this.cons = cons;
                }
            };
            (function (Transitions) {
                Transitions[Transitions["NONE"] = 0] = "NONE";
                Transitions[Transitions["LINEAR"] = 1] = "LINEAR";
                Transitions[Transitions["SINUSOIDAL"] = 2] = "SINUSOIDAL";
            })(Transitions || (Transitions = {}));
            BodyPart = class BodyPart {
                constructor(img, point1, point2, transitionType) {
                    this.img = img;
                    this.point1 = point1;
                    this.point2 = point2;
                    this.transitionType = transitionType;
                }
                getPos() {
                    let transition;
                    switch (this.transitionType) {
                        case Transitions.NONE:
                            {
                                transition = 0;
                            }
                            break;
                        case Transitions.LINEAR:
                            {
                                transition = Math.abs((-music_1.music.timer.getTime() % music_1.music.temp) / music_1.music.temp - 0.5) * 2;
                            }
                            break;
                        case Transitions.SINUSOIDAL:
                            {
                                transition = Math.sin((-music_1.music.timer.getTime() % music_1.music.temp) / music_1.music.temp * 2 * Math.PI) / 2 + 0.5;
                            }
                            break;
                    }
                    let pos = this.point1.add(this.point2.sub(this.point1).mul(transition));
                    return pos;
                }
            };
            InvisibleMan = class InvisibleMan extends Enemy {
                constructor() {
                    super();
                    this.hitpoints = 8;
                    this.maxHitpoints = 8;
                    this.damage = 1;
                    this.defence = 1;
                    this.name = localization_1.getString("enemy.invisibleman");
                    this.description = localization_1.getString("enemy.invisibleman.action.check.result");
                    this.acts.push(new Act(localization_1.getString("enemy.invisibleman.action.confuse"), localization_1.getString("enemy.invisibleman.action.confuse.result"), (enemies, activeEnemy, activeAct, heart) => { enemies[activeEnemy].defence += 1; }));
                    this.acts.push(new Act(localization_1.getString("enemy.invisibleman.action.threaten"), localization_1.getString("enemy.invisibleman.action.threaten.result"), (enemies, activeEnemy, activeAct, heart) => {
                        enemies[activeEnemy].mercy = 1;
                        enemies[activeEnemy].obligatoryComments.push(localization_1.getString("enemy.invisibleman.comments.reaction.threaten"));
                        enemies[activeEnemy].obligatoryPhrases.push(localization_1.getString("enemy.invisibleman.phrases.reaction.threaten"));
                    }));
                    this.acts.push(new Act(localization_1.getString("enemy.invisibleman.action.ignore"), localization_1.getString("enemy.invisibleman.action.ignore.result"), (enemies, activeEnemy, activeAct, heart) => { enemies[activeEnemy].tempDamage += 1; }));
                    this.mainParts.push(new BodyPart(resources_2.imgInvisibleManBoots, new math_4.Vector(0, 0), new math_4.Vector(0, 0), Transitions.NONE));
                    this.mainParts.push(new BodyPart(resources_2.imgInvisibleManTrench, new math_4.Vector(0, -10), new math_4.Vector(0, 5), Transitions.SINUSOIDAL));
                    this.mainParts.push(new BodyPart(resources_2.imgInvisibleManHead, new math_4.Vector(0, -10), new math_4.Vector(0, 20), Transitions.SINUSOIDAL));
                    this.partsDefeated.push(new BodyPart(resources_2.imgInvisibleManDefeat, new math_4.Vector(-2, 0), new math_4.Vector(2, 0), Transitions.SINUSOIDAL));
                    this.defaultComments.push(localization_1.getString("enemy.invisibleman.comments.random.1"));
                    this.defaultComments.push(localization_1.getString("enemy.invisibleman.comments.random.2"));
                    this.defaultComments.push(localization_1.getString("enemy.invisibleman.comments.random.3"));
                    this.defaultComments.push(localization_1.getString("enemy.invisibleman.comments.random.4"));
                    this.defaultPhrases.push(localization_1.getString("enemy.invisibleman.phrases.random.1"));
                    this.defaultPhrases.push(localization_1.getString("enemy.invisibleman.phrases.random.2"));
                    this.defaultPhrases.push(localization_1.getString("enemy.invisibleman.phrases.random.3"));
                    this.defaultPhrases.push(localization_1.getString("enemy.invisibleman.phrases.random.4"));
                    this.defaultPhrases.push(localization_1.getString("enemy.invisibleman.phrases.random.5"));
                    this.defaultPhrases.push(localization_1.getString("enemy.invisibleman.phrases.random.6"));
                }
            };
            exports_10("InvisibleMan", InvisibleMan);
        }
    };
});
System.register("choiseBox", ["math", "drawing", "input"], function (exports_11, context_11) {
    "use strict";
    var math_6, drawing_6, drawing_7, input_2, CHOICE_RESULT_NONE, Option, ChoiseBox;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (math_6_1) {
                math_6 = math_6_1;
            },
            function (drawing_6_1) {
                drawing_6 = drawing_6_1;
                drawing_7 = drawing_6_1;
            },
            function (input_2_1) {
                input_2 = input_2_1;
            }
        ],
        execute: function () {
            exports_11("CHOICE_RESULT_NONE", CHOICE_RESULT_NONE = -1);
            Option = class Option {
                constructor(choice, color, available) {
                    this.choice = choice;
                    this.color = color;
                    this.available = available;
                }
            };
            exports_11("Option", Option);
            ChoiseBox = class ChoiseBox {
                constructor(pos, size) {
                    this.options = [];
                    this.currentChoise = 0;
                    this.result = CHOICE_RESULT_NONE;
                    this.pos = pos;
                    this.size = size;
                }
                clear() {
                    this.options = [];
                    this.currentChoise = 0;
                    this.result = CHOICE_RESULT_NONE;
                }
                updateChoise(heartPos) {
                    this.currentChoise += Number(input_2.rightKey.wentDown) - Number(input_2.leftKey.wentDown);
                    this.currentChoise += 2 * (Number(input_2.downKey.wentDown) - Number(input_2.upKey.wentDown));
                    this.currentChoise = math_6.clamp(this.currentChoise, 0, this.options.length - 1);
                    if (input_2.zKey.wentDown && this.options[this.currentChoise].available) {
                        heartPos = new math_6.Vector(1000, 1000);
                        this.result = this.currentChoise;
                        input_2.zKey.wentDown = false;
                    }
                    else {
                        heartPos = this.getHeartPos();
                    }
                    return heartPos;
                }
                draw() {
                    let offsetX = this.size.x;
                    let rowsCount = Math.ceil(this.options.length / 2);
                    let offsetY = rowsCount === 1 ? 1 : this.size.y / (rowsCount - 1);
                    for (let choiceIndex = 0; choiceIndex < this.options.length; choiceIndex++) {
                        let x = this.pos.x - this.size.x / 2;
                        let y = this.pos.y;
                        y -= rowsCount === 1 ? 0 : this.size.y / 2;
                        x += offsetX * (choiceIndex % 2);
                        y += offsetY * Math.floor(choiceIndex / 2);
                        let align = choiceIndex % 2 === 0 ? "left" : "right";
                        x += choiceIndex % 2 === 0 ? 25 : -25;
                        let alpha = 1;
                        if (!this.options[choiceIndex].available) {
                            alpha = drawing_7.TRANSPARENCY;
                        }
                        drawing_6.drawText(x, y, this.options[choiceIndex].choice, drawing_6.TEXT_KEGEL, "Big", false, this.options[choiceIndex].color, align, undefined, alpha);
                    }
                }
                getHeartPos() {
                    let offsetX = this.size.x;
                    let rowsCount = Math.ceil(this.options.length / 2);
                    let offsetY = rowsCount === 1 ? 1 : this.size.y / (rowsCount - 1);
                    let x = this.pos.x - this.size.x / 2;
                    let y = this.pos.y;
                    y -= rowsCount === 1 ? 0 : this.size.y / 2;
                    x += offsetX * (this.currentChoise % 2);
                    y += offsetY * Math.floor(this.currentChoise / 2);
                    return new math_6.Vector(x, y);
                }
            };
            exports_11("ChoiseBox", ChoiseBox);
        }
    };
});
System.register("fightButton", ["math", "drawing", "input"], function (exports_12, context_12) {
    "use strict";
    var math_7, drawing_8, math_8, input_3, FightButton;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (math_7_1) {
                math_7 = math_7_1;
                math_8 = math_7_1;
            },
            function (drawing_8_1) {
                drawing_8 = drawing_8_1;
            },
            function (input_3_1) {
                input_3 = input_3_1;
            }
        ],
        execute: function () {
            FightButton = class FightButton {
                constructor(pos, size, text, icon) {
                    this.pos = new math_7.Vector(0, 0);
                    this.size = new math_7.Vector(0, 0);
                    this.pressed = false;
                    this.activated = false;
                    this.size = size;
                    this.pos = pos;
                    this.text = text;
                    this.icon = icon;
                }
                draw() {
                    let color = "yellow";
                    drawing_8.drawRect(this.pos.x, this.pos.y, this.size.x, this.size.y, 0, "black");
                    if (!this.pressed) {
                        color = "orange";
                        drawing_8.drawImage(this.pos.x - this.size.x / 3, this.pos.y, this.size.y * 0.66, this.size.y * 0.66, 0, this.icon);
                    }
                    drawing_8.drawRect(this.pos.x, this.pos.y, this.size.x, this.size.y, 0, color, 5);
                    drawing_8.drawText(this.pos.x + this.size.x / 7, this.pos.y, this.text, Math.round(this.size.y * 0.5), "Big", true, color);
                }
                updateButton() {
                    this.pressed = false;
                    this.activated = false;
                }
                checkCollision(pos) {
                    if (math_8.isInRect(pos, this.pos, this.size)) {
                        this.pressed = true;
                        if (input_3.zKey.wentDown) {
                            this.activated = true;
                        }
                    }
                }
            };
            exports_12("FightButton", FightButton);
        }
    };
});
System.register("hitBox", ["math", "drawing", "input"], function (exports_13, context_13) {
    "use strict";
    var math_9, drawing_9, input_4, MIN_SPEED, MAX_SPEED, HIT_WIDTH, HIT_MIN, HIT_MAX, HIT_VALUE_MISS, HitState, GREAT_HIT_MULTIPLIER, HitBox;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (math_9_1) {
                math_9 = math_9_1;
            },
            function (drawing_9_1) {
                drawing_9 = drawing_9_1;
            },
            function (input_4_1) {
                input_4 = input_4_1;
            }
        ],
        execute: function () {
            MIN_SPEED = 0.01;
            MAX_SPEED = 0.017;
            HIT_WIDTH = 0.05;
            HIT_MIN = 0.5;
            HIT_MAX = 1 - HIT_WIDTH / 2;
            HIT_VALUE_MISS = -1;
            (function (HitState) {
                HitState[HitState["LAND_HIT"] = -1] = "LAND_HIT";
                HitState[HitState["ENDED"] = 0] = "ENDED";
                HitState[HitState["PLAYING"] = 1] = "PLAYING";
            })(HitState || (HitState = {}));
            exports_13("HitState", HitState);
            GREAT_HIT_MULTIPLIER = 2;
            HitBox = class HitBox {
                constructor(pos, size) {
                    this.pos = new math_9.Vector(0, 0);
                    this.size = new math_9.Vector(0, 0);
                    this.state = HitState.ENDED;
                    this.indicator = 0;
                    this.speed = 0;
                    this.value = 0;
                    this.hitPos = 0;
                    this.pos = pos;
                    this.size = size;
                    this.clear();
                }
                clear() {
                    this.state = HitState.PLAYING;
                    this.indicator = 0;
                    this.speed = math_9.getRandomFloat(MIN_SPEED, MAX_SPEED) * this.size.x;
                    this.value = 0;
                    this.hitPos = math_9.getRandomFloat(HIT_MIN, HIT_MAX) * this.size.x;
                }
                updateIndicator() {
                    if (this.state === HitState.LAND_HIT) {
                        this.state = HitState.ENDED;
                    }
                    if (this.state === HitState.PLAYING) {
                        this.indicator += this.speed;
                        if (input_4.zKey.wentDown) {
                            if (this.indicator < this.hitPos) {
                                this.value = this.indicator / this.hitPos;
                            }
                            else {
                                this.value = (this.size.x - this.indicator) / (this.size.x - this.hitPos);
                            }
                            let hitWidth = HIT_WIDTH * this.size.x;
                            if (this.indicator >= this.hitPos - hitWidth / 2 &&
                                this.indicator <= this.hitPos + hitWidth / 2) {
                                this.value *= GREAT_HIT_MULTIPLIER;
                            }
                            this.state = HitState.LAND_HIT;
                        }
                        if (this.indicator > this.size.x) {
                            this.indicator = this.size.x;
                            this.state = HitState.ENDED;
                            this.value = HIT_VALUE_MISS;
                        }
                    }
                }
                draw() {
                    let hitWidth = HIT_WIDTH * this.size.x;
                    drawing_9.drawRect(this.pos.x - this.size.x / 2 + this.hitPos, this.pos.y, hitWidth, this.size.y, 0, "red", 10);
                    drawing_9.drawPolygon(this.pos.x - this.size.x / 2 + this.indicator, this.pos.y, "white", [new math_9.Vector(0, -this.size.y / 2), new math_9.Vector(0, this.size.y / 2)], 7);
                }
            };
            exports_13("HitBox", HitBox);
        }
    };
});
System.register("healthBox", ["math", "drawing", "timers"], function (exports_14, context_14) {
    "use strict";
    var math_10, drawing_10, timers_4, STANDART_HEALTH_BAR_WIDTH, STANDART_HEALTH_BAR_HEIGHT, STANDART_HEALTH_BAR_TIME, STANDART_HEALTH_BAR_DEPLETION_TIME, DMG_OFFSET_Y, HealthBox;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (math_10_1) {
                math_10 = math_10_1;
            },
            function (drawing_10_1) {
                drawing_10 = drawing_10_1;
            },
            function (timers_4_1) {
                timers_4 = timers_4_1;
            }
        ],
        execute: function () {
            STANDART_HEALTH_BAR_WIDTH = 300;
            STANDART_HEALTH_BAR_HEIGHT = 50;
            STANDART_HEALTH_BAR_TIME = 100;
            STANDART_HEALTH_BAR_DEPLETION_TIME = 0.7;
            DMG_OFFSET_Y = -50;
            HealthBox = class HealthBox {
                constructor() {
                    this.timer = new timers_4.Timer(0);
                    this.ended = true;
                    this.pos = new math_10.Vector(0, 0);
                    this.startAmount = 0;
                    this.damage = 0;
                    this.maxAmount = 0;
                    this.width = 0;
                    this.time = 0;
                }
                playAnimation(pos, startAmount, damage, maxAmount, time = STANDART_HEALTH_BAR_TIME, width = STANDART_HEALTH_BAR_WIDTH) {
                    this.pos = pos;
                    this.startAmount = startAmount;
                    this.damage = damage;
                    this.maxAmount = maxAmount;
                    this.width = width;
                    this.ended = false;
                    this.time = time;
                    this.timer.setTime(time);
                }
                update() {
                    if (this.timer.getTime() < 0) {
                        this.ended = true;
                    }
                }
                draw() {
                    let progress = this.timer.getTime() / this.time;
                    progress -= 1 - STANDART_HEALTH_BAR_DEPLETION_TIME;
                    progress /= STANDART_HEALTH_BAR_DEPLETION_TIME;
                    progress = Math.max(0, progress);
                    let hp = Math.max(0, this.startAmount + (progress - 1) * this.damage);
                    let width = hp / this.maxAmount * this.width;
                    let diff = this.width - width;
                    drawing_10.drawText(this.pos.x, this.pos.y + DMG_OFFSET_Y, String(this.damage), drawing_10.TEXT_KEGEL * 2, "Big", true, "red");
                    drawing_10.drawText(this.pos.x, this.pos.y + DMG_OFFSET_Y, String(this.damage), drawing_10.TEXT_KEGEL * 2, "Big", true, "darkred", undefined, undefined, undefined, 1);
                    drawing_10.drawRect(this.pos.x, this.pos.y, this.width, STANDART_HEALTH_BAR_HEIGHT, 0, "red");
                    drawing_10.drawRect(this.pos.x - diff / 2, this.pos.y, width, STANDART_HEALTH_BAR_HEIGHT, 0, "green");
                    drawing_10.drawRect(this.pos.x, this.pos.y, this.width, STANDART_HEALTH_BAR_HEIGHT, 0, "darkred", 4);
                }
            };
            exports_14("HealthBox", HealthBox);
        }
    };
});
System.register("movement", ["math", "input"], function (exports_15, context_15) {
    "use strict";
    var math_11, input_5;
    var __moduleName = context_15 && context_15.id;
    function getMovingSpeed(speed) {
        return new math_11.Vector((Number(input_5.rightKey.isDown) - Number(input_5.leftKey.isDown)) * speed.x, (Number(input_5.downKey.isDown) - Number(input_5.upKey.isDown)) * speed.y);
    }
    exports_15("getMovingSpeed", getMovingSpeed);
    function movePlayer(pos, speed) {
        return pos.add(speed);
    }
    exports_15("movePlayer", movePlayer);
    return {
        setters: [
            function (math_11_1) {
                math_11 = math_11_1;
            },
            function (input_5_1) {
                input_5 = input_5_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("collisions", [], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    function checkPointCollisionWithWall(pos, speed, wallPoint, normal) {
        let newPos = pos.add(speed).sub(wallPoint);
        let depth = newPos.dot(normal);
        if (depth < 0) {
            speed = speed.sub(normal.mul(depth * 0.99));
        }
        return speed;
    }
    function checkRoundCollisionWithWall(pos, radius, speed, wall) {
        let wallVec = wall[1].sub(wall[0]);
        let toObjVec = pos.sub(wall[0]);
        let normal = wallVec.cross(toObjVec).cross(wallVec).unit();
        let offset = normal.mul(radius);
        let newWall = [wall[0].add(offset), wall[1].add(offset)];
        return checkPointCollisionWithWall(pos, speed, newWall[0], normal);
    }
    function checkRoundCollisionWithBox(pos, radius, speed, points) {
        for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
            let point1 = points[pointIndex];
            let point2 = points[(pointIndex + 1) % points.length];
            speed = checkRoundCollisionWithWall(pos, radius, speed, [point1, point2]);
        }
        return speed;
    }
    exports_16("checkRoundCollisionWithBox", checkRoundCollisionWithBox);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("fight", ["math", "drawing", "enemies", "resources", "box", "choiseBox", "fightButton", "localization", "hitBox", "healthBox", "textBox", "movement", "collisions", "input", "timers"], function (exports_17, context_17) {
    "use strict";
    var math_12, drawing_11, enemies_2, resources_3, drawing_12, box_1, choiseBox_1, fightButton_1, resources_4, localization_2, hitBox_1, healthBox_1, textBox_2, resources_5, box_2, movement_1, collisions_1, movement_2, input_6, timers_5, STANDART_BOX_SIZE, STANDART_BOX_POS, STANDART_TEXT_BOX_SIZE, STANDART_TEXT_BOX_POS, TEXT_BOX_SIZE_DIFF, STANDART_BUTTON_SIZE, BUTTON_Y_OFFSET, DISTANCE_BETWEEN_ENEMIES, ENEMIES_POS_Y, BoxPoint, Button, FightState, TREMBLE_FREQUENCY, TREMBLE_AMOUNT, TEXT_BOX_OFFSET_X, HEART_SIZE, GameState, state, Heart, heart, Fight, fight;
    var __moduleName = context_17 && context_17.id;
    function getEnemyPosX(enemyIndex) {
        let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
        let posX = -width / 2 + DISTANCE_BETWEEN_ENEMIES * enemyIndex;
        return posX;
    }
    function startFight(enemies, phrase) {
        fight = new Fight(heart);
        exports_17("state", state = GameState.FIGHT);
        fight.enemies = enemies;
        fight.comment = phrase;
        fight.textBox.setPos(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE.sub(TEXT_BOX_SIZE_DIFF));
        for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
            fight.enemies[enemyIndex].pos = new math_12.Vector(getEnemyPosX(enemyIndex), ENEMIES_POS_Y);
        }
    }
    exports_17("startFight", startFight);
    function winCondition() {
        let win = true;
        for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
            win = win && fight.enemies[enemyIndex].defeated();
        }
        if (win) {
            toStateText(localization_2.getString("fight.interface.won"));
        }
        return win;
    }
    function showMercy() {
        if (fight.enemies[fight.activeEnemy].mercy >= 1) {
            fight.enemies[fight.activeEnemy].mercy = enemies_2.ENEMY_SPARED;
            if (!winCondition()) {
                toStateDialogue();
            }
        }
        else {
            fight.enemies[fight.activeEnemy].mercyAct(fight.enemies, fight.activeEnemy, fight.choiseBox.result, fight.heart);
            toStateDialogue();
        }
    }
    function toStateDialogue() {
        fight.state = FightState.DIALOGUE;
        fight.box.startTransition(box_2.getRectanglePoints(STANDART_BOX_POS, STANDART_BOX_SIZE), 0.5);
        fight.heart.pos = STANDART_BOX_POS;
        for (let textIndex = 0; textIndex < fight.enemies.length; textIndex++) {
            fight.enemies[textIndex].setNextText();
        }
    }
    function updateTextInStateDialogue() {
        if (fight.state === FightState.DIALOGUE) {
            let dialogueOver = true;
            for (let textIndex = 0; textIndex < fight.enemies.length; textIndex++) {
                dialogueOver = dialogueOver && (fight.enemies[textIndex].dialogueRead() || fight.enemies[textIndex].defeated());
            }
            if (dialogueOver) {
                toStateFight();
            }
        }
    }
    function toStateFight() {
        fight.state = FightState.FIGHT;
        fight.fightTimer.setTime(10);
    }
    function movePlayerInFightState() {
        if (fight.state === FightState.FIGHT) {
            let speed = movement_2.getMovingSpeed(fight.heart.speedConst);
            speed = collisions_1.checkRoundCollisionWithBox(fight.heart.pos, fight.heart.collisionRadius, speed, fight.box.points);
            fight.heart.pos = movement_1.movePlayer(fight.heart.pos, speed);
        }
    }
    function endFightPhaseWithTimer() {
        if (fight.fightTimer.timeExpired() && fight.state === FightState.FIGHT) {
            toStateMain();
            fight.box.startTransition(box_2.getRectanglePoints(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE), 0.5);
            fight.comment = fight.nextComment();
        }
    }
    function toStateMain() {
        fight.state = FightState.MAIN;
    }
    function toStateText(text) {
        fight.textBox.newText(text);
        fight.state = FightState.TEXT;
    }
    function updateTextInTextState() {
        if (fight.state === FightState.TEXT) {
            fight.textBox.updateText();
            if (fight.textBox.read) {
                if (fight.activeButton === Button.MERCY || fight.activeButton === Button.FIGHT) {
                    exports_17("state", state = GameState.WONDER);
                }
                else {
                    toStateDialogue();
                }
            }
        }
    }
    function toStateActions() {
        fight.choiseBox.clear();
        fight.state = FightState.ACTIONS;
        for (let actIndex = 0; actIndex < fight.enemies[fight.activeEnemy].acts.length; actIndex++) {
            fight.choiseBox.options.push(new choiseBox_1.Option(fight.enemies[fight.activeEnemy].acts[actIndex].name, "white", true));
        }
    }
    function updateChoiseInActionsState() {
        if (fight.state === FightState.ACTIONS) {
            fight.heart.pos = fight.choiseBox.updateChoise(fight.heart.pos);
            if (fight.choiseBox.result !== choiseBox_1.CHOICE_RESULT_NONE) {
                let act = fight.enemies[fight.activeEnemy].acts[fight.choiseBox.result];
                act.cons(fight.enemies, fight.activeEnemy, fight.choiseBox.result, fight.heart);
                toStateText(act.text);
            }
            if (input_6.xKey.wentDown) {
                toStateChoise();
            }
        }
    }
    function toStateHit() {
        fight.state = FightState.HIT;
        fight.hitBox.clear();
    }
    function updateHitInHitState() {
        if (fight.state === FightState.HIT) {
            fight.hitBox.updateIndicator();
            fight.healthbox.update();
            if (fight.hitBox.state !== hitBox_1.HitState.PLAYING) {
                {
                    if (fight.hitBox.state === hitBox_1.HitState.LAND_HIT) {
                        resources_5.animHit.startAnimation(10, false);
                    }
                    else if (resources_5.animHit.changeTimer.getTime() === 0) {
                        let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
                        let xPos = -width / 2 + DISTANCE_BETWEEN_ENEMIES * fight.activeEnemy;
                        let damage = Math.ceil(heart.damage / fight.enemies[fight.activeEnemy].defence * fight.hitBox.value);
                        fight.healthbox.playAnimation(new math_12.Vector(xPos, ENEMIES_POS_Y), fight.enemies[fight.activeEnemy].hitpoints, damage, fight.enemies[fight.activeEnemy].maxHitpoints);
                        fight.enemies[fight.activeEnemy].hitpoints -= damage;
                    }
                    else if (!resources_5.animHit.playing && fight.healthbox.ended) {
                        if (!winCondition()) {
                            toStateDialogue();
                        }
                    }
                }
            }
        }
    }
    function toStateChoise() {
        fight.activeEnemy = -1;
        fight.choiseBox.clear();
        fight.state = FightState.CHOICE;
        for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
            fight.choiseBox.options.push(new choiseBox_1.Option(fight.enemies[enemyIndex].name, fight.enemies[enemyIndex].mercy >= 1 ? "yellow" : "white", fight.enemies[enemyIndex].defeated() ? false : true));
        }
    }
    function updateChoiseInChoiseState() {
        if (fight.state === FightState.CHOICE) {
            fight.heart.pos = fight.choiseBox.updateChoise(fight.heart.pos);
            if (fight.choiseBox.result !== choiseBox_1.CHOICE_RESULT_NONE) {
                fight.activeEnemy = fight.choiseBox.result;
                if (fight.activeButton === Button.FIGHT) {
                    toStateHit();
                }
                if (fight.activeButton === Button.ACT) {
                    toStateActions();
                }
                if (fight.activeButton === Button.MERCY) {
                    showMercy();
                }
            }
            if (input_6.xKey.wentDown) {
                toStateMain();
            }
        }
    }
    function drawEnemy(enemyIndex) {
        let enemy = fight.enemies[enemyIndex];
        let posX = getEnemyPosX(enemyIndex);
        if (fight.state === FightState.HIT && fight.hitBox.state === hitBox_1.HitState.ENDED &&
            fight.activeEnemy === enemyIndex) {
            let addPosX = 0;
            if (!resources_5.animHit.playing) {
                let tremblePower = Math.floor(fight.healthbox.timer.getTime() / TREMBLE_FREQUENCY);
                addPosX = ((Math.floor(tremblePower) % 2) * 2 - 1) * TREMBLE_AMOUNT * tremblePower;
            }
            enemy.draw(new math_12.Vector(posX + addPosX, ENEMIES_POS_Y), false);
        }
        else {
            enemy.draw(new math_12.Vector(posX, ENEMIES_POS_Y));
        }
    }
    function drawEnemies() {
        for (let enemyIndex = 0; enemyIndex < fight.enemies.length; enemyIndex++) {
            drawEnemy(enemyIndex);
        }
    }
    function drawMenuComments() {
        if (!fight.box.checkTransition()) {
            drawing_12.drawParagraph(STANDART_TEXT_BOX_POS.x - (STANDART_TEXT_BOX_SIZE.x - 200) / 2, STANDART_TEXT_BOX_POS.y - (STANDART_TEXT_BOX_SIZE.y - 90) / 2, fight.comment, drawing_12.TEXT_KEGEL, "Big", false, "white", STANDART_TEXT_BOX_SIZE.x - 100, drawing_12.TEXT_KEGEL * 1.5);
        }
    }
    function drawElements() {
        fight.buttons.forEach((button) => { button.draw(); });
        drawEnemies();
        fight.box.draw();
        if (fight.state === FightState.MAIN) {
            drawMenuComments();
        }
        if (fight.state === FightState.CHOICE ||
            fight.state === FightState.ACTIONS) {
            fight.choiseBox.draw();
        }
        if (fight.state === FightState.TEXT) {
            fight.textBox.draw();
        }
        if (fight.state === FightState.HIT) {
            fight.hitBox.draw();
            if (resources_5.animHit.playing) {
                let width = fight.enemies.length !== 1 ? DISTANCE_BETWEEN_ENEMIES * (fight.enemies.length - 1) : 0;
                let xPos = -width / 2 + DISTANCE_BETWEEN_ENEMIES * fight.activeEnemy;
                drawing_12.drawImage(xPos, ENEMIES_POS_Y, 70 * drawing_11.FIGHT_IMAGE_SCALING, 120 * drawing_11.FIGHT_IMAGE_SCALING, 0, resources_5.animHit);
            }
            if (!fight.healthbox.ended) {
                fight.healthbox.draw();
            }
        }
        if (fight.state === FightState.DIALOGUE) {
            for (let textIndex = 0; textIndex < fight.enemies.length; textIndex++) {
                if (!fight.enemies[textIndex].defeated()) {
                    fight.enemies[textIndex].drawDialogueBox();
                }
            }
        }
        fight.heart.draw();
    }
    function pickMove() {
        if (fight.buttons[Button.FIGHT].activated) {
            fight.activeButton = Button.FIGHT;
        }
        if (fight.buttons[Button.ACT].activated) {
            fight.activeButton = Button.ACT;
        }
        if (fight.buttons[Button.ITEM].activated) {
            fight.activeButton = Button.ITEM;
        }
        if (fight.buttons[Button.MERCY].activated) {
            fight.activeButton = Button.MERCY;
        }
    }
    function activateButtonsInMainState() {
        if (fight.state === FightState.MAIN) {
            if (fight.buttons[Button.FIGHT].activated ||
                fight.buttons[Button.ACT].activated ||
                fight.buttons[Button.MERCY].activated) {
                toStateChoise();
            }
            if (fight.buttons[Button.ITEM].activated) {
            }
            pickMove();
        }
    }
    function changeButtonInMainState() {
        if (fight.state === FightState.MAIN) {
            fight.activeButton = fight.activeButton + (Number(input_6.rightKey.wentDown) - Number(input_6.leftKey.wentDown));
            fight.activeButton = math_12.clamp(fight.activeButton, 0, fight.buttons.length - 1);
            fight.heart.pos = new math_12.Vector(fight.buttons[fight.activeButton].pos.x - fight.buttons[fight.activeButton].size.x / 3, fight.buttons[fight.activeButton].pos.y);
        }
    }
    function updateButtons() {
        fight.buttons.forEach((button) => { button.updateButton(); button.checkCollision(fight.heart.pos); });
    }
    function loopFight() {
        drawing_11.camera.pos = new math_12.Vector(0, 0);
        drawing_11.clearCanvas("black");
        fight.box.updateTransition();
        changeButtonInMainState();
        activateButtonsInMainState();
        movePlayerInFightState();
        endFightPhaseWithTimer();
        updateChoiseInChoiseState();
        updateChoiseInActionsState();
        updateHitInHitState();
        updateTextInTextState();
        updateTextInStateDialogue();
        updateButtons();
        drawElements();
    }
    exports_17("loopFight", loopFight);
    return {
        setters: [
            function (math_12_1) {
                math_12 = math_12_1;
            },
            function (drawing_11_1) {
                drawing_11 = drawing_11_1;
                drawing_12 = drawing_11_1;
            },
            function (enemies_2_1) {
                enemies_2 = enemies_2_1;
            },
            function (resources_3_1) {
                resources_3 = resources_3_1;
                resources_4 = resources_3_1;
                resources_5 = resources_3_1;
            },
            function (box_1_1) {
                box_1 = box_1_1;
                box_2 = box_1_1;
            },
            function (choiseBox_1_1) {
                choiseBox_1 = choiseBox_1_1;
            },
            function (fightButton_1_1) {
                fightButton_1 = fightButton_1_1;
            },
            function (localization_2_1) {
                localization_2 = localization_2_1;
            },
            function (hitBox_1_1) {
                hitBox_1 = hitBox_1_1;
            },
            function (healthBox_1_1) {
                healthBox_1 = healthBox_1_1;
            },
            function (textBox_2_1) {
                textBox_2 = textBox_2_1;
            },
            function (movement_1_1) {
                movement_1 = movement_1_1;
                movement_2 = movement_1_1;
            },
            function (collisions_1_1) {
                collisions_1 = collisions_1_1;
            },
            function (input_6_1) {
                input_6 = input_6_1;
            },
            function (timers_5_1) {
                timers_5 = timers_5_1;
            }
        ],
        execute: function () {
            STANDART_BOX_SIZE = new math_12.Vector(300, 300);
            STANDART_BOX_POS = new math_12.Vector(0, 130);
            exports_17("STANDART_TEXT_BOX_SIZE", STANDART_TEXT_BOX_SIZE = new math_12.Vector(1200, 240));
            exports_17("STANDART_TEXT_BOX_POS", STANDART_TEXT_BOX_POS = new math_12.Vector(0, 160));
            exports_17("TEXT_BOX_SIZE_DIFF", TEXT_BOX_SIZE_DIFF = new math_12.Vector(200, 60));
            STANDART_BUTTON_SIZE = new math_12.Vector(220, 80);
            BUTTON_Y_OFFSET = 60;
            DISTANCE_BETWEEN_ENEMIES = drawing_11.canvas.width / 4;
            ENEMIES_POS_Y = -drawing_11.canvas.height / 4.4;
            (function (BoxPoint) {
                BoxPoint[BoxPoint["BOTTOM_RIGHT"] = 0] = "BOTTOM_RIGHT";
                BoxPoint[BoxPoint["BOTTOM_LEFT"] = 1] = "BOTTOM_LEFT";
                BoxPoint[BoxPoint["TOP_LEFT"] = 2] = "TOP_LEFT";
                BoxPoint[BoxPoint["TOP_RIGHT"] = 3] = "TOP_RIGHT";
            })(BoxPoint || (BoxPoint = {}));
            (function (Button) {
                Button[Button["FIGHT"] = 0] = "FIGHT";
                Button[Button["ACT"] = 1] = "ACT";
                Button[Button["ITEM"] = 2] = "ITEM";
                Button[Button["MERCY"] = 3] = "MERCY";
            })(Button || (Button = {}));
            (function (FightState) {
                FightState[FightState["MAIN"] = 0] = "MAIN";
                FightState[FightState["FIGHT"] = 1] = "FIGHT";
                FightState[FightState["DIALOGUE"] = 2] = "DIALOGUE";
                FightState[FightState["CHOICE"] = 3] = "CHOICE";
                FightState[FightState["ACTIONS"] = 4] = "ACTIONS";
                FightState[FightState["ITEMS"] = 5] = "ITEMS";
                FightState[FightState["TEXT"] = 6] = "TEXT";
                FightState[FightState["HIT"] = 7] = "HIT";
            })(FightState || (FightState = {}));
            TREMBLE_FREQUENCY = 6;
            TREMBLE_AMOUNT = 1;
            TEXT_BOX_OFFSET_X = 250;
            HEART_SIZE = new math_12.Vector(32, 32);
            (function (GameState) {
                GameState[GameState["FIGHT"] = 0] = "FIGHT";
                GameState[GameState["WONDER"] = 1] = "WONDER";
            })(GameState || (GameState = {}));
            exports_17("GameState", GameState);
            exports_17("state", state = GameState.WONDER);
            Heart = class Heart {
                constructor() {
                    this.pos = new math_12.Vector(0, 0);
                    this.collisionRadius = 18;
                    this.sprite = resources_3.imgHeart;
                    this.damage = 1;
                    this.defence = 1;
                    this.speedConst = new math_12.Vector(2, 2);
                }
                draw() {
                    drawing_12.drawImage(this.pos.x, this.pos.y, HEART_SIZE.x, HEART_SIZE.y, 0, this.sprite);
                }
            };
            exports_17("Heart", Heart);
            heart = new Heart();
            Fight = class Fight {
                constructor(heart) {
                    this.state = FightState.MAIN;
                    this.fightTimer = new timers_5.Timer(-1);
                    this.enemies = [];
                    this.activeEnemy = -1;
                    this.buttons = [new fightButton_1.FightButton(new math_12.Vector(-drawing_11.canvas.width / 2 + drawing_11.canvas.width / 5, drawing_11.canvas.height / 2 - BUTTON_Y_OFFSET), STANDART_BUTTON_SIZE, localization_2.getString("fight.interface.fight"), resources_4.imgFight),
                        new fightButton_1.FightButton(new math_12.Vector(-drawing_11.canvas.width / 2 + drawing_11.canvas.width / 5 * 2, drawing_11.canvas.height / 2 - BUTTON_Y_OFFSET), STANDART_BUTTON_SIZE, localization_2.getString("fight.interface.action"), resources_4.imgAct),
                        new fightButton_1.FightButton(new math_12.Vector(-drawing_11.canvas.width / 2 + drawing_11.canvas.width / 5 * 3, drawing_11.canvas.height / 2 - BUTTON_Y_OFFSET), STANDART_BUTTON_SIZE, localization_2.getString("fight.interface.item"), resources_4.imgItem),
                        new fightButton_1.FightButton(new math_12.Vector(-drawing_11.canvas.width / 2 + drawing_11.canvas.width / 5 * 4, drawing_11.canvas.height / 2 - BUTTON_Y_OFFSET), STANDART_BUTTON_SIZE, localization_2.getString("fight.interface.mercy"), resources_4.imgMercy)];
                    this.activeButton = Button.FIGHT;
                    this.box = new box_1.Box();
                    this.choiseBox = new choiseBox_1.ChoiseBox(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE.sub(new math_12.Vector(200, 90)));
                    this.textBox = new textBox_2.TextBox();
                    this.hitBox = new hitBox_1.HitBox(STANDART_TEXT_BOX_POS, STANDART_TEXT_BOX_SIZE);
                    this.comment = "";
                    this.healthbox = new healthBox_1.HealthBox();
                    this.heart = heart;
                }
                nextComment() {
                    let randomIndex = math_12.getRandomInt(0, this.enemies.length - 1);
                    let result = this.enemies[randomIndex].nextComment();
                    for (let enemyIndex = 0; enemyIndex < this.enemies.length; enemyIndex++) {
                        if (this.enemies[enemyIndex].obligatoryComments.length > 0) {
                            result = this.enemies[enemyIndex].nextComment();
                            break;
                        }
                    }
                    return result;
                }
            };
        }
    };
});
System.register("box", ["math", "drawing", "fight"], function (exports_18, context_18) {
    "use strict";
    var math_13, drawing_13, fight_1, BOX_TRANSITION_SPEED, POINT_EPSILON, Box;
    var __moduleName = context_18 && context_18.id;
    function getRectanglePoints(pos, size) {
        return [new math_13.Vector(pos.x + size.x / 2, pos.y + size.y / 2),
            new math_13.Vector(pos.x - size.x / 2, pos.y + size.y / 2),
            new math_13.Vector(pos.x - size.x / 2, pos.y - size.y / 2),
            new math_13.Vector(pos.x + size.x / 2, pos.y - size.y / 2)];
    }
    exports_18("getRectanglePoints", getRectanglePoints);
    return {
        setters: [
            function (math_13_1) {
                math_13 = math_13_1;
            },
            function (drawing_13_1) {
                drawing_13 = drawing_13_1;
            },
            function (fight_1_1) {
                fight_1 = fight_1_1;
            }
        ],
        execute: function () {
            BOX_TRANSITION_SPEED = 0.9;
            POINT_EPSILON = 1e-3;
            Box = class Box {
                constructor() {
                    this.points = getRectanglePoints(fight_1.STANDART_TEXT_BOX_POS, fight_1.STANDART_TEXT_BOX_SIZE);
                    this.transitionTo = getRectanglePoints(fight_1.STANDART_TEXT_BOX_POS, fight_1.STANDART_TEXT_BOX_SIZE);
                    this.transitionSpeed = BOX_TRANSITION_SPEED;
                }
                moveBy(speed) {
                    let newPoints = [];
                    for (let pointIndex = 0; pointIndex < this.points.length; pointIndex++) {
                        newPoints.push(this.points[pointIndex].add(speed));
                    }
                    return newPoints;
                }
                draw() {
                    drawing_13.drawPolygon(0, 0, "black", this.points);
                    drawing_13.drawPolygon(0, 0, "white", this.points, 5);
                }
                startTransition(to, speed) {
                    this.transitionTo = to;
                    this.transitionSpeed = speed;
                }
                updateTransition() {
                    for (let pointIndex = 0; pointIndex < this.transitionTo.length; pointIndex++) {
                        this.points[pointIndex] = this.points[pointIndex].add(this.transitionTo[pointIndex].sub(this.points[pointIndex]).mul(this.transitionSpeed));
                    }
                }
                checkTransition() {
                    let res = false;
                    for (let pointIndex = 0; pointIndex < this.transitionTo.length; pointIndex++) {
                        if (this.points[pointIndex].sub(this.transitionTo[pointIndex]).length() > POINT_EPSILON) {
                            res = true;
                        }
                    }
                    return res;
                }
            };
            exports_18("Box", Box);
        }
    };
});
System.register("wander", ["math", "movement", "resources", "drawing", "input", "fight", "enemies", "localization"], function (exports_19, context_19) {
    "use strict";
    var math_14, movement_3, resources_6, drawing_14, input_7, fight_2, enemies_3, localization_3, WALK_ANIMATION_SPEED, RUN_ANIMATION_SPEED, WALK_SPEED, RUN_SPEED_MULTIPLIER, Player, Lexa, player;
    var __moduleName = context_19 && context_19.id;
    function updatePlayer(player) {
        let multiplier = 1;
        if (input_7.xKey.isDown) {
            player.changeAnimationsSpeed(RUN_ANIMATION_SPEED);
            multiplier *= RUN_SPEED_MULTIPLIER;
        }
        else {
            player.changeAnimationsSpeed(WALK_ANIMATION_SPEED);
        }
        let speed = movement_3.getMovingSpeed(player.speedConst.mul(multiplier));
        player.chooseSprite(speed);
        player.pos = movement_3.movePlayer(player.pos, speed);
        drawing_14.camera.pos = player.pos;
        player.draw();
    }
    function loopWander() {
        if (input_7.enterKey.wentDown) {
            fight_2.startFight([new enemies_3.InvisibleMan(), new enemies_3.InvisibleMan()], localization_3.getString("fight.start.enemy.invisibleman"));
        }
        updatePlayer(player);
        drawing_14.drawRect(0, 0, 100, 100, 0, "red");
    }
    exports_19("loopWander", loopWander);
    return {
        setters: [
            function (math_14_1) {
                math_14 = math_14_1;
            },
            function (movement_3_1) {
                movement_3 = movement_3_1;
            },
            function (resources_6_1) {
                resources_6 = resources_6_1;
            },
            function (drawing_14_1) {
                drawing_14 = drawing_14_1;
            },
            function (input_7_1) {
                input_7 = input_7_1;
            },
            function (fight_2_1) {
                fight_2 = fight_2_1;
            },
            function (enemies_3_1) {
                enemies_3 = enemies_3_1;
            },
            function (localization_3_1) {
                localization_3 = localization_3_1;
            }
        ],
        execute: function () {
            WALK_ANIMATION_SPEED = 10;
            RUN_ANIMATION_SPEED = 6;
            WALK_SPEED = 5;
            RUN_SPEED_MULTIPLIER = 2;
            Player = class Player {
                constructor() {
                    this.pos = new math_14.Vector(0, 0);
                    this.speedConst = new math_14.Vector(WALK_SPEED, WALK_SPEED);
                    this.sprite = resources_6.imgNone;
                    this.frontIdle = resources_6.imgNone;
                    this.backIdle = resources_6.imgNone;
                    this.sideIdleRight = resources_6.imgNone;
                    this.sideIdleLeft = resources_6.imgNone;
                    this.frontMovement = new resources_6.AnimatedImg();
                    this.backMovement = new resources_6.AnimatedImg();
                    this.sideMovementRight = new resources_6.AnimatedImg();
                    this.sideMovementLeft = new resources_6.AnimatedImg();
                }
                initWalkAnimations() {
                    this.frontMovement.startAnimation(WALK_ANIMATION_SPEED, true);
                    this.backMovement.startAnimation(WALK_ANIMATION_SPEED, true);
                    this.sideMovementRight.startAnimation(WALK_ANIMATION_SPEED, true);
                    this.sideMovementLeft.startAnimation(WALK_ANIMATION_SPEED, true);
                }
                changeAnimationsSpeed(delay) {
                    this.frontMovement.changeDelay(delay);
                    this.backMovement.changeDelay(delay);
                    this.sideMovementRight.changeDelay(delay);
                    this.sideMovementLeft.changeDelay(delay);
                }
                chooseSprite(speed) {
                    if (speed.y > 0) {
                        this.sprite = this.frontMovement;
                    }
                    else if (speed.y < 0) {
                        this.sprite = this.backMovement;
                    }
                    else if (speed.x > 0) {
                        this.sprite = this.sideMovementRight;
                    }
                    else if (speed.x < 0) {
                        this.sprite = this.sideMovementLeft;
                    }
                    else {
                        switch (this.sprite) {
                            case this.frontMovement:
                                {
                                    this.sprite = this.frontIdle;
                                }
                                break;
                            case this.backMovement:
                                {
                                    this.sprite = this.backIdle;
                                }
                                break;
                            case this.sideMovementRight:
                                {
                                    this.sprite = this.sideIdleRight;
                                }
                                break;
                            case this.sideMovementLeft:
                                {
                                    this.sprite = this.sideIdleLeft;
                                }
                                break;
                        }
                    }
                }
                draw() {
                    drawing_14.drawImage(this.pos.x, this.pos.y, undefined, undefined, 0, this.sprite);
                }
            };
            Lexa = class Lexa extends Player {
                constructor() {
                    super();
                    this.sprite = resources_6.imgLexa;
                    this.frontIdle = resources_6.imgLexa;
                    this.backIdle = resources_6.imgLexaBack;
                    this.sideIdleRight = resources_6.imgLexaSideRight;
                    this.sideIdleLeft = resources_6.imgLexaSideLeft;
                    this.frontMovement = resources_6.animLexaWalk;
                    this.backMovement = resources_6.animLexaWalkBack;
                    this.sideMovementRight = resources_6.animLexaWalkSideRight;
                    this.sideMovementLeft = resources_6.animLexaWalkSideLeft;
                    this.initWalkAnimations();
                }
            };
            player = new Lexa();
        }
    };
});
System.register("index", ["drawing", "fight", "input", "timers", "wander"], function (exports_20, context_20) {
    "use strict";
    var drawing_15, fight_3, input_8, timers_6, wander_js_1;
    var __moduleName = context_20 && context_20.id;
    function loop() {
        switch (fight_3.state) {
            case fight_3.GameState.FIGHT:
                {
                    fight_3.loopFight();
                }
                break;
            case fight_3.GameState.WONDER:
                {
                    wander_js_1.loopWander();
                }
                break;
        }
    }
    function mainLoop() {
        drawing_15.clearCanvas("grey");
        loop();
        input_8.clearKeys();
        timers_6.Timer.updateTimers();
        requestAnimationFrame(mainLoop);
    }
    return {
        setters: [
            function (drawing_15_1) {
                drawing_15 = drawing_15_1;
            },
            function (fight_3_1) {
                fight_3 = fight_3_1;
            },
            function (input_8_1) {
                input_8 = input_8_1;
            },
            function (timers_6_1) {
                timers_6 = timers_6_1;
            },
            function (wander_js_1_1) {
                wander_js_1 = wander_js_1_1;
            }
        ],
        execute: function () {
            requestAnimationFrame(mainLoop);
        }
    };
});
System.register("interactionBox", ["choiseBox", "textBox", "fight"], function (exports_21, context_21) {
    "use strict";
    var choiseBox_2, textBox_3, fight_4, InteractionType, Choise, Interaction, InteractionBox;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (choiseBox_2_1) {
                choiseBox_2 = choiseBox_2_1;
            },
            function (textBox_3_1) {
                textBox_3 = textBox_3_1;
            },
            function (fight_4_1) {
                fight_4 = fight_4_1;
            }
        ],
        execute: function () {
            (function (InteractionType) {
                InteractionType[InteractionType["TEXT"] = 0] = "TEXT";
                InteractionType[InteractionType["CHOICE"] = 1] = "CHOICE";
            })(InteractionType || (InteractionType = {}));
            Choise = class Choise {
                constructor(option, text, cons) {
                    this.option = option;
                    this.text = text;
                    this.cons = cons;
                }
            };
            exports_21("Choise", Choise);
            Interaction = class Interaction {
                constructor() {
                    this.type = InteractionType.TEXT;
                    this.text = "";
                    this.choises = [];
                }
                static getTextInteraction(text) {
                    let inter = new Interaction;
                    inter.type = InteractionType.TEXT;
                    inter.text = text;
                    return inter;
                }
                static getChoiseInteraction(choises) {
                    let inter = new Interaction;
                    inter.type = InteractionType.CHOICE;
                    inter.choises = choises;
                    return inter;
                }
            };
            exports_21("Interaction", Interaction);
            InteractionBox = class InteractionBox {
                constructor(pos, size) {
                    this.interactions = [];
                    this.interactionIndex = 0;
                    this.ended = false;
                    this.pos = pos;
                    this.size = size;
                    this.textBox = new textBox_3.TextBox();
                    this.textBox.setPos(pos, size.sub(fight_4.TEXT_BOX_SIZE_DIFF));
                    this.choiseBox = new choiseBox_2.ChoiseBox(pos, size.sub(fight_4.TEXT_BOX_SIZE_DIFF));
                }
                setInteraction(interactions) {
                    this.interactionIndex = 0;
                    this.interactions = interactions;
                    this.ended = false;
                }
                setNextInteraction() {
                    this.interactionIndex++;
                    switch (this.interactions[this.interactionIndex].type) {
                        case InteractionType.TEXT:
                            {
                                this.textBox.newText(this.interactions[this.interactionIndex].text);
                            }
                            break;
                        case InteractionType.CHOICE:
                            {
                                this.choiseBox.clear();
                                for (let choiseIndex = 0; choiseIndex < this.interactions[this.interactionIndex].choises.length; choiseIndex++) {
                                    this.choiseBox.options.push(this.interactions[this.interactionIndex].choises[choiseIndex].option);
                                }
                            }
                            break;
                    }
                }
                updateInteractions(heartPos) {
                    if (!this.ended) {
                        switch (this.interactions[this.interactionIndex].type) {
                            case InteractionType.TEXT:
                                {
                                    this.textBox.updateText();
                                }
                                break;
                            case InteractionType.CHOICE:
                                {
                                    let value = this.choiseBox.result;
                                    heartPos = this.choiseBox.updateChoise(heartPos);
                                    if (this.choiseBox.result != value) {
                                        this.interactions[this.interactionIndex].choises[this.choiseBox.result].cons();
                                        if (this.interactions[this.interactionIndex].choises[this.choiseBox.result].text !== "") {
                                            this.textBox.newText(this.interactions[this.interactionIndex].choises[this.choiseBox.result].text);
                                        }
                                    }
                                }
                                break;
                        }
                        if (this.textBox.read && this.choiseBox.result !== choiseBox_2.CHOICE_RESULT_NONE) {
                            if (this.interactionIndex + 1 < this.interactions.length) {
                                this.setNextInteraction();
                            }
                            else {
                                this.ended = true;
                            }
                        }
                    }
                    return heartPos;
                }
            };
            exports_21("InteractionBox", InteractionBox);
        }
    };
});
//# sourceMappingURL=index.js.map