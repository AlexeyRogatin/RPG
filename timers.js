let timers = [];

function getTimer(time) {
    timers.push(time);
    return timers.length - 1;
}

function setTimer(timer, time) {
    timers[timer] = time;
}

function getTime(timer) {
    return timers[timer];
}

function timeExpired(timer) {
    return getTime(timer) <= 0;
}

function updateTimers() {
    for (let timerIndex = 0; timerIndex < timers.length; timerIndex++) {
        timers[timerIndex]--;
    }
}