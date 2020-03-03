export class TimeCapture extends Date {
  constructor (...args) {
    super(...args)
    this.day = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][this.getDay()]
    this.month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'][this.getMonth()]
    this.date = `${this.day}, ${this.getDate()} ${this.month.replace(/(ь|й)$|(т)$/, (match, p1, p2) => {
      if (p1) return 'я'
      if (p2) return match + 'а'
    })}`
    this.week = ['над чертой', 'под чертой'][(this.getWeekNumber() - 1) % 2]
  }

  getWeekNumber () {
    const MILLISECS_IN_WEEK = 604800000
    const FIRST_WEEK_IN_SEMESTER = new Date('2020-02-03 00:00:00')
    return Math.ceil((this.getTime() - FIRST_WEEK_IN_SEMESTER.getTime()) / MILLISECS_IN_WEEK)
  }

  getMinutesToday () {
    return this.getHours() * 60 + this.getMinutes()
  }

  getPhase (phases) {
    const today = this.getMinutesToday()
    console.log(today)

    for (let i = 0; i < phases.length; i++) {
      console.log(i, phases[i].from, phases[i].to)

      if (phases[i].from <= today && today < phases[i].to) {
        return i + getFraction(today, phases[i].from, phases[i].to)
      }
    }

    function getFraction (num, min, max) {
      return (num - min) / (max - min)
    }
  }
}
