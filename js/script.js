//The constant indicates the time elapsed from 1970 to 01/01/1973 (the first day of this year is Monday)
const FIRST_MONDAY = 94683600000;
const MILLISECS_IN_WEEK = 604800000;
const MILLISECS_IN_CLASS = 4800000;

const dayDOM = document.querySelector('.today-info__day');
const dateDOM = document.querySelector('.today-info__date');
const weekDOM = document.querySelector('.today-info__week');
const toggleWeeks = document.querySelector('.change-week input[type="checkbox"]');

function isOddWeek(dateObj) { // return 1 (true) - odd, return 0 (false) - even
    let currentWeek = Math.ceil((dateObj.getTime() - FIRST_MONDAY) / MILLISECS_IN_WEEK);
    return currentWeek % 2;
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

function getClassProgress(dateObj, lesson) {
    const currentTime = ((dateObj.getHours() * 60) + dateObj.getMinutes()); // minutes

    switch (lesson) {
        case 0:
            return (currentTime - 540) / 0.8;
        case 1:
            return (currentTime - 630) / 0.8;
        case 2:
            return (currentTime - 740) / 0.8;
        case 3:
            return (currentTime - 830) / 0.8;
        case 4:
            return (currentTime - 920) / 0.8;
        case 5:
            return (currentTime - 1010) / 0.8;
        default:
            return -1;
    }
}

function setWeekDayPosition (currentDate) {
    let weekDay = new Array();
    weekDay[0];
    weekDay[1] = "mon";
    weekDay[2] = "tue";
    weekDay[3] = "wed";
    weekDay[4] = "thu";
    weekDay[5] = "fri";
    weekDay[6]; 
    window.location.hash = weekDay[ currentDate.getDay() ];
}