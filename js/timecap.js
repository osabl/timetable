class TimeCapture extends Date {
    constructor(...args) {
        super(...args);

        this.day = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][this.getDay()];
        this.month = ['января', 'февраря', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][this.getMonth()];
        this.date = `${this.day}, ${this.getDate()} ${this.month}`;
        this.week = ['над чертой', 'под чертой'][this.getWeek()];
    }


    getWeek() {
        const MILLISECS_IN_WEEK = 604800000;
        const FIRST_WEEK_IN_SEMESTER = new Date('2020-02-03');

        return Math.ceil((this.getTime() - FIRST_WEEK_IN_SEMESTER) / MILLISECS_IN_WEEK) % 2;
    }

    getMinutesToday() {
        return this.getHours() * 60 + this.getMinutes();
    }

    getPhase(phases) {
        if (!phases || phases.length == 0) {
            phases = [
                //[from, to]
                [0, 539],
                [540, 619],
                [620, 629],
                [630, 709],
                [710, 739],
                [740, 819],
                [820, 829],
                [830, 909],
                [910, 919],
                [920, 999],
                [1000, 1009],
                [1010, 1089],
                [1090, 1439]
            ];
        }

        const today = this.getMinutesToday();

        for (let i = 0; i < phases.length; i++) {
            if (phases[i][0] <= today && today <= phases[i][1]) {
                return i + getFraction(today, phases[i][0], phases[i][1]);
            }
        }

        function getFraction(num, min, max) {
            return (num - min) / (max - min);
        }
    }
}