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
  const toggleBtn = document.querySelector('.toggle > img')
  const toggle = document.querySelector('.toggle')
  const header = document.querySelector('.header')
  const pagination = document.querySelector('.swiper-pagination')
  const days = document.querySelectorAll('.day')
  const flipElements = [toggle, header, pagination, ...days]
  const nextFlipElements = [toggle, pagination, ...days]

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    const deferredPrompt = e

    const install = document.createElement('div')
    install.className = 'install'

    const installBtn = document.createElement('img')
    installBtn.src = '/assets/img/download.png'
    installBtn.alt = 'скачать'

    install.append(installBtn)
    header.append(install)

    install.addEventListener('click', (e) => {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        } else {
          console.log('User dismissed the install prompt')
          install.remove()
        }
      })
    })
  })

  window.addEventListener('appinstalled', (evt) => {
    document.querySelector('.install').remove()
  })

  toggleBtn.addEventListener('click', () => {
    for (const elem of days) {
      elem.classList.toggle('flip')
    }
    pagination.classList.toggle('flip')
    toggle.classList.toggle('flip')
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
    let duration = 80 // in minutes
    let phase = timecap.getPhase(defaultPhases)

    const currentDay = days[timecap.getDay() - 1]

    const lessons = currentDay.querySelectorAll('.card')[(timecap.getWeekNumber() - 1) % 2].querySelectorAll('.lesson')
    if (lessons.length === 1 && lessons[0].getAttribute('class').includes('day-off')) {
      phase = timecap.getPhase([
        { from: 0, to: 0 },
        { from: 0, to: 1439 }
      ])
      duration = 1439
    }

    lessonsToday = lessons.length

    if (phase === undefined && timecap.getPhase(defaultBreakPhases) !== undefined) {
      throw new Error('BREAK')
    }

    const currentLesson = lessons[Math.floor(phase) - 1]

    const lessonAttr = currentLesson.getAttribute('class') + ' active'
    currentLesson.setAttribute('class', lessonAttr)

    // TIME PROGRESS
    const timeProgress = currentLesson.querySelector('.time .progress-over')
    timeProgress.style.height = `${(phase - Math.floor(phase)) * 100}%`

    const timeEnd = currentLesson.querySelector('.time > :last-child')
    timeEnd.textContent = timeConvert(duration * (1 - (phase - Math.floor(phase))))
    timeEnd.classList.toggle('countdown')
  } catch (err) {
    console.log(err)
    console.log('Maybe today is a day off or there are no more lessons)')
  }

  dateInfo.textContent = timecap.date
  weekInfo.textContent = timecap.week

  const swiper = new Swiper('.swiper', {
    initialSlide: getCustomDay(timecap, lessonsToday, defaultPhases, nextFlipElements),
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

  const preloader = document.querySelector('#preloader')
  const preloaderStyle = document.querySelector('#preloader-style')
  preloader.style.opacity = '0'
  setTimeout(() => {
    preloader.remove()
    preloaderStyle.remove()
  }, 1000)
}

function getCustomDay (TimeCapture, lessonsToday, phases = defaultPhases, flipElements) {
  let day = 0

  if (TimeCapture.getDay() > 0 && TimeCapture.getDay() < 6) {
    day = TimeCapture.getDay() - 1
  }

  if (Math.floor(TimeCapture.getPhase(phases)) > lessonsToday || Math.floor(timecap.getPhase(defaultBreakPhases)) >= lessonsToday - 1) {
    if (TimeCapture.getDay() > 4 || TimeCapture.getDay() === 0) {
      for (const elem of flipElements) {
        elem.classList.toggle('flip')
      }

      return 0
    }

    return day + 1
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
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  const minutes = m < 10 ? `0${m}` : `${m}`

  return `${h}:${minutes}`
}
