class TimeCapture extends Date {
    constructor(...args) {
        super(...args);

        this.day = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][this.getDay()];
        this.month = ['января', 'февраря', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][this.getMonth()];
        this.date = `${this.day}, ${this.getDate()} ${this.month}`;
    }
}