//The constant indicates the time elapsed from 1970 to 01/01/1973 (the first day of this year is Monday)
const FIRST_MONDAY = 94683600000;
const MILLISECS_IN_WEEK = 604800000;
const MILLISECS_IN_CLASS = 4800000;

const dayInfo = document.querySelector('.today-info__day');
const dateInfo = document.querySelector('.today-info__date');
const weekInfo = document.querySelector('.today-info__week');
const toggleWeeks = document.querySelector('.change-week input[type="checkbox"]');
const week = document.querySelector('.week');
const days = document.querySelectorAll('.day');

const date = new Date();

setActiveWeek(date);
setWeekDayPosition(date);
dayInfo.textContent = getCurrentDay(date);
dateInfo.textContent = getCurrentDate(date);
weekInfo.textContent = getCurrentWeek(date);
setActiveDay(date);
setActiveClass(date);
setProgress(date);
setPastTime(date);
setTimeLeft(date);
toggleWeeks.addEventListener('click', toggleWeek);


function setActiveDay(dateObj) {
    try {
        let day = days[dateObj.getDay() - 1];
        let attributes = day.getAttribute("class") + " active";
        day.setAttribute('class', attributes);
    } catch (error) {
        console.log(error);
        console.log('Maybe today is a day off)');
    }
}

function setActiveClass(dateObj) {
    try {
        const lessons = getLessonsOfDay(dateObj);
        const lesson = lessons[getCurrentClass(dateObj)];
        let attributes = lesson.getAttribute("class") + " active";
        lesson.setAttribute('class', attributes);
    } catch (error) {
        console.log(error);
        console.log('Maybe there are no more lessons)');
    }
}

function setPastTime(dateObj) {
    try {
        let pastTime = getPastTime(dateObj, getCurrentClass(dateObj));
        let startTime = document.createElement('div');
        startTime.className = 'past-time';
        startTime.textContent = formatTime(pastTime);

        let elem = getLessonsOfDay(dateObj)[getCurrentClass(dateObj)]
            .querySelector('.time-bar__time');

        elem.prepend(startTime);
    } catch (error) {}
}

function setTimeLeft(dateObj) {
    try {
        let timeLeft = getTimeLeft(dateObj, getCurrentClass(dateObj));
        let endTime = document.createElement('div');
        endTime.className = 'time-left';
        endTime.textContent = formatTime(timeLeft);

        let elem = getLessonsOfDay(dateObj)[getCurrentClass(dateObj)]
            .querySelector('.time-bar__time');

        elem.append(endTime);
    } catch (error) {}
}

function setProgress(dateObj) {
    try {
        let elem = getLessonsOfDay(dateObj)[getCurrentClass(dateObj)]
            .querySelector('.progressbar > span');
        let progress = getClassProgress(date, getCurrentClass(date), MILLISECS_IN_CLASS);
        elem.style.width = `${progress}%`;
    } catch (error) {}
}

function setActiveWeek(dateObj) {
    if (isOddWeek(dateObj)) {
        week.setAttribute('class', 'week odd active');
        toggleWeeks.checked = true;
    } else {
        week.setAttribute('class', 'week even active');
        toggleWeeks.checked = false;
    }
}

function toggleWeek() {
    week.classList.toggle('even');
    week.classList.toggle('odd');
    week.classList.toggle('active');
}

function isOddWeek(dateObj) { // return 1 (true) - odd, return 0 (false) - even
    let currentWeek = Math.ceil((dateObj.getTime() - FIRST_MONDAY) / MILLISECS_IN_WEEK);
    return currentWeek % 2;
}

function getCurrentWeek(dateObj) {
    if (isOddWeek(dateObj)) {
        return 'под чертой';
    } else {
        return 'над чертой';
    }
}

function getCurrentDate(dateObj) {
    let date = `${dateObj.getDate()} `;

    switch (dateObj.getMonth()) {
        case 0:
            date += 'Января';
            break;
        case 1:
            date += 'Февраля';
            break;
        case 2:
            date += 'Марта';
            break;
        case 3:
            date += 'Апреля';
            break;
        case 4:
            date += 'Майа';
            break;
        case 5:
            date += 'Июня';
            break;
        case 6:
            date += 'Июля';
            break;
        case 7:
            date += 'Августа';
            break;
        case 8:
            date += 'Сентября';
            break;
        case 9:
            date += 'Октября';
            break;
        case 10:
            date += 'Ноября';
            break;
        case 11:
            date += 'Декабря';
            break;
    }

    return date;
}

function getCurrentDay(dateObj) {
    switch (dateObj.getDay()) {
        case 0:
            return 'Воскресенье';
        case 1:
            return 'Понедельник';
        case 2:
            return 'Вторник';
        case 3:
            return 'Среда';
        case 4:
            return 'Четверг';
        case 5:
            return 'Пятница';
        case 6:
            return 'Суббота';
    }
}

function getCurrentClass(dateObj) {
    const currentTime = ((dateObj.getHours() * 60) + dateObj.getMinutes()); // minutes

    if (currentTime < 540 || 1090 < currentTime) { // > 9:00 - 18:10 <
        return -1;
    } else if (currentTime >= 540 && 620 >= currentTime) { // < 9:00 - 10:20 >
        return 0;
    } else if (currentTime >= 630 && 710 >= currentTime) { // < 10:30 - 11:50 >
        return 1;
    } else if (currentTime >= 740 && 820 >= currentTime) { // < 12:20 - 13:40 >
        return 2;
    } else if (currentTime >= 830 && 910 >= currentTime) { // < 13:50 - 15:10 >
        return 3;
    } else if (currentTime >= 920 && 1000 >= currentTime) { // < 15:20 - 16:40 >
        return 4;
    } else if (currentTime >= 1010 && 1090 >= currentTime) { // < 16:50 - 18:10 >
        return 5;
    }
}

function getLessonsOfDay(dateObj) {
    let reverseWeek;
    let lessons = [];
    if (isOddWeek(dateObj)) {
        reverseWeek = 'even';
    } else {
        reverseWeek = 'odd';
    }

    const elemList = days[dateObj.getDay() - 1].querySelectorAll('.class');
    elemList.forEach((elem) => {
        if (!elem.classList.contains(reverseWeek)) {
            lessons.push(elem);
        }
    });

    return lessons;
}

function getPastTime(dateObj, lesson) {
    const currentTime = ((dateObj.getHours() * 60) + dateObj.getMinutes()); // minutes

    switch (lesson) {
        case 0:
            return (currentTime - 540);
        case 1:
            return (currentTime - 630);
        case 2:
            return (currentTime - 740);
        case 3:
            return (currentTime - 830);
        case 4:
            return (currentTime - 920);
        case 5:
            return (currentTime - 1010);
        default:
            return -1;
    }
}

function getTimeLeft(dateObj, lesson) {
    const currentTime = ((dateObj.getHours() * 60) + dateObj.getMinutes()); // minutes

    switch (lesson) {
        case 0:
            return (620 - currentTime);
        case 1:
            return (710 - currentTime);
        case 2:
            return (820 - currentTime);
        case 3:
            return (910 - currentTime);
        case 4:
            return (1000 - currentTime);
        case 5:
            return (1090 - currentTime);
        default:
            return -1;
    }
}

function getClassProgress(dateObj, lesson, duration = 4800000) {
    const currentTime = ((dateObj.getHours() * 60) + dateObj.getMinutes()); // minutes

    switch (lesson) {
        case 0:
            return (currentTime - 540) / (duration / 6000000); // 6 000 000 = 1000ms * 60s * 100% - for convert ms to min
        case 1:
            return (currentTime - 630) / (duration / 6000000);
        case 2:
            return (currentTime - 740) / (duration / 6000000);
        case 3:
            return (currentTime - 830) / (duration / 6000000);
        case 4:
            return (currentTime - 920) / (duration / 6000000);
        case 5:
            return (currentTime - 1010) / (duration / 6000000);
        default:
            return -1;
    }
}

function setWeekDayPosition(currentDate) {
    let weekDay = new Array();
    weekDay[0];
    weekDay[1] = "mon";
    weekDay[2] = "tue";
    weekDay[3] = "wed";
    weekDay[4] = "thu";
    weekDay[5] = "fri";
    weekDay[6];
    window.location.hash = weekDay[currentDate.getDay()];
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    return `${hours}:${min < 10 ? '0'+ min : min}`;
}