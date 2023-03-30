export class Timer {
    static timers: Timer[] = [];
    time: number = -1;
    constructor(time: number) {
        this.time = time;
        Timer.timers.push(this);
    }

    static updateTimers() {
        for (let index = 0; index < this.timers.length; index++) {
            this.timers[index].time--;
        }
    }

    setTime(time: number) {
        this.time = time;
    }

    getTime() {
        return this.time;
    }

    timeExpired() {
        return this.time <= 0;
    }
}