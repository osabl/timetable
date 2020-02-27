export class TimeCapture extends Date {
  constructor (...args) {
    super(...args)
    this.day = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][this.getDay()]
    this.month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'][this.getMonth()]
    this.date = `${this.day}, ${this.getDate()} ${this.month.replace(/(ь|й)$|(т)$/, (match, p1, p2) => {
      if (p1) return 'я'
      if (p2) return match + 'а'
    })}`
    this.week = ['над чертой', 'под чертой'][this.getWeek()]
  }

  getWeek () {
    const MILLISECS_IN_WEEK = 604800000
    const FIRST_WEEK_IN_SEMESTER = new Date('2020-02-03')
    return Math.ceil((this.getTime() - FIRST_WEEK_IN_SEMESTER) / MILLISECS_IN_WEEK) % 2
  }

  getMinutesToday () {
    return this.getHours() * 60 + this.getMinutes()
  }

  getPhase (phases) {
    const today = this.getMinutesToday()

    for (let i = 0; i < phases.length; i++) {
      if (phases[i][0] <= today && today <= phases[i][1]) {
        return i + getFraction(today, phases[i][0], phases[i][1])
      }
    }

    function getFraction (num, min, max) {
      return (num - min) / (max - min)
    }
  }
}
