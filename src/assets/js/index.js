import { sizer } from './sizer'
import Swiper from 'swiper'
import { TimeCapture } from './timecap'

const defaultPhases = [
  { from: 0, to: 539 },
  { from: 540, to: 620 },
  { from: 630, to: 710 },
  { from: 740, to: 820 },
  { from: 830, to: 910 },
  { from: 920, to: 1000 },
  { from: 1010, to: 1090 },
  { from: 1091, to: 1439 }
]

const defaultBreakPhases = [
  { from: 621, to: 630 },
  { from: 711, to: 740 },
  { from: 821, to: 830 },
  { from: 911, to: 920 },
  { from: 1001, to: 1010 }
]

const timecap = new TimeCapture()

window.onload = function () {
  const dateInfo = document.querySelector('#date')
  const weekInfo = document.querySelector('#week')

  const toggle = document.querySelector('.toggle > img')
  const header = document.querySelector('.header')
  const pagination = document.querySelector('.swiper-pagination')
  const days = document.querySelectorAll('.day')
  const flipElements = [toggle, header, pagination, ...days]

  toggle.addEventListener('click', () => {
    for (const elem of days) {
      elem.classList.toggle('flip')
    }
    pagination.classList.toggle('flip')
  })

  if ((timecap.getWeekNumber() - 1) % 2) {
    for (const elem of flipElements) {
      const attr = elem.getAttribute('class') + ' flip'
      elem.setAttribute('class', attr)
    }
  }

  let lessonsToday = 0

  sizer()

  try {
    const phase = timecap.getPhase(defaultPhases)
    console.log(phase)

    const currentDay = days[timecap.getDay() - 1]
    console.log(currentDay)

    const lessons = currentDay.querySelectorAll('.card')[(timecap.getWeekNumber() - 1) % 2].querySelectorAll('.lesson')
    console.log(lessons)

    // get number of lessons
    lessonsToday = lessons.length
    console.log('lessons: ' + lessonsToday)
    if (phase === undefined && timecap.getPhase(defaultBreakPhases) !== undefined) {
      throw new Error('BREAK')
    }

    const currentLesson = lessons[Math.floor(phase) - 1]
    console.log(currentLesson)

    const lessonAttr = currentLesson.getAttribute('class') + ' active'
    currentLesson.setAttribute('class', lessonAttr)

    // TIME PROGRESS
    const timeProgress = currentLesson.querySelector('.time .progress-over')
    timeProgress.style.height = `${(phase - Math.floor(phase)) * 100}%`
    console.log(timeProgress)
    console.log((phase - Math.floor(phase)) * 100)

    const timeEnd = currentLesson.querySelector('.time > :last-child')
    timeEnd.textContent = timeConvert(80 * (1 - (phase - Math.floor(phase))))
    timeEnd.classList.toggle('countdown')
    console.log('time: ' + timeConvert(80 * (1 - (phase - Math.floor(phase)))))
  } catch (err) {
    console.log(err)
    console.log('Maybe today is a day off or there are no more lessons)')
  }

  dateInfo.textContent = timecap.date
  weekInfo.textContent = timecap.week

  const swiper = new Swiper('.swiper', {
    initialSlide: getCustomDay(timecap, lessonsToday),
    speed: 500,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    breakpoints: {
      641: {
        slidesPerView: 2
      },
      961: {
        slidesPerView: 3
      },
      1281: {
        slidesPerView: 4
      },
      1601: {
        pagination: false,
        slidesPerView: 5
      }
    }
  })
}

function getCustomDay (TimeCapture, lessonsToday, phases = defaultPhases) {
  let day = 0

  if (TimeCapture.getDay() > 0 && TimeCapture.getDay() < 6) {
    day = TimeCapture.getDay() - 1
  }

  if (Math.floor(TimeCapture.getPhase(phases)) > lessonsToday || Math.floor(timecap.getPhase(defaultBreakPhases)) >= lessonsToday - 1) {
    return day === 5 ? day : day + 1
  }

  return day
}

// function flip (element) {
//   const elem = this.getElement(element)
//   elem.classList.toggle('flip')
// }

// function getElement (item) {
//   if (item instanceof Element || item instanceof HTMLDocument) {
//     return item
//   } else if (typeof (item) === 'string') {
//     return document.querySelector(item)
//   } else {
//     throw new TypeError('Expected DOM element')
//   }
// }

function timeConvert (min) {
  const hours = Math.floor(min / 60)
  const minutes = Math.round(min % 60)

  return `${hours}:${minutes}`
}
