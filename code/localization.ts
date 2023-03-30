const LOCAL_ENGLISH = 0;
const LOCAL_RUSSIAN = 1;

let local = LOCAL_ENGLISH;

export function getString(string: string) {
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

let englishLocalization: Record<string, string> = {
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
}

let russianLocalization: Record<string, string> = {
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
    "enemy.invisibleman.action.confuse.result":
        "Вы попытались запутать Человека-невидимку, но он не обратил внимания~Кажется, Вы запутались сами.\nЕго защита увеличена",

    "enemy.invisibleman.action.threaten": "Угрожать",
    "enemy.invisibleman.action.threaten.result":
        "Вы сказали Человеку-невидимке, что Вы видите его насквозь,~он выглядит напуганным.",

    "enemy.invisibleman.action.ignore": "Игнорировать",
    "enemy.invisibleman.action.ignore.result":
        "Вы отвернулись от Человека-невидимки и он исчез!~Сила его следующей атаки увеличина.",

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
}