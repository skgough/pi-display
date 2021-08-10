const dateTime = document.querySelector('#datetime')
const calendar = document.querySelector('#calendar')
const qrCode = document.querySelector('#qr .code')
const wifi = document.querySelector('#wifi')
const qr = document.querySelector('#qr')
const weatherEl = document.querySelector('#weather')
const forecastEl = document.querySelector('#forecast')
const temp =  document.querySelector('.temp')
const riseTime =  document.querySelector('.rise > span')
const setTime =  document.querySelector('.set > span')

showTime()
weather()

setInterval(weather,3600000)

dateTime.addEventListener('click', showCalendar)
calendar.addEventListener('click', () => {
    document.body.classList = ''
    calendar.querySelector('.table').innerHTML = ''
})

wifi.addEventListener('click', () => {
    document.body.classList.add('wifi')
})
qr.addEventListener('click', () => {
    document.body.classList = ''
})
// weatherEl.addEventListener('click', forecast)

function weather() {
    getWeather().then((weather) => {
        temp.innerText = `${parseInt(weather.main.temp)}°F`
        riseTime.innerText = getTimeFromUnix(weather.sys.sunrise)
        setTime.innerText = getTimeFromUnix(weather.sys.sunset)
    }) 
}
function forecast() {
    getForecast().then((forecast) => {
        let HTML = ""
        let details = `<div class="details">`
        forecast.list.forEach((time) => time.day_of_month = getDoMFromUnix(time.dt))
        const days = groupBy(forecast.list, 'day_of_month')
        for (const day in days) {
            const current = days[day]
            HTML += `
<button class="day" data-day="${day}">
    <div class="date">${(parseInt(day) === today()) ? "Today" : getDoWFromUnix(current[0].dt)}</div>
    <div class="description">${current[parseInt(current.length/2)].weather[0].main}</div>
    <div class="temprange">
        <div class="low">${getLow(current)}°</div>
        <div class="high">${getHigh(current)}°</div>
    </div>`
            details += `
    <div class="day" data-day=${day}>`
            for(const time of days[day]) {
                time.date = getDateFromUnix(time.dt)
                time.time = getTimeFromUnix(time.dt)
                details += `   
        <div class="timestep">
            <div class="time">${time.time}</div>
            <div class="temp">${parseInt(time.main.temp)}°F</div>
            <div class="description">${time.weather[0].main}</div>
        </div>`
            }
            details+=`
    </div>`
            HTML += `
    </div>
</div>`
        }
        details +=`
</div>`
        HTML += `<button class="exit"></button>`
        forecastEl.innerHTML = HTML + details
        const buttons = forecastEl.querySelectorAll('button.day')
        for (const each of buttons) {
            each.addEventListener('click', () => {
                if (each.classList.contains('active')) {
                    each.classList.remove('active');
                    forecastEl.classList.remove('details')
                    const details = document.querySelectorAll('.details .day.visible')
                    for (detail of details) {
                        detail.classList.remove('visible')
                    }
                } else {
                    const tabs = document.querySelectorAll('button.day')
                    for (const tab of tabs) {
                        tab.classList.remove('active')
                    }
                    const details = document.querySelectorAll('.details .day.visible')
                    for (detail of details) {
                        detail.classList.remove('visible')
                    }
                    each.classList.add('active')
                    document.querySelector(`#forecast .details .day[data-day="${each.dataset.day}"]`).classList.add('visible')
                    forecastEl.classList.add('details')
                }
            })
        }
        forecastEl.querySelector('.exit').addEventListener('click', () => {
            document.body.classList = ''
            setTimeout(() => {
                forecastEl.innerHTML = ''
            }, 300)
        })
        const images = forecastEl.querySelectorAll('img[data-src]')
        let promises = []
        for (const image of images) {
            promises.push(loadImage(image))
        }
        Promise.all(promises).then(() => {
            document.body.classList.add('forecast')
        })
    })
}

function showTime() {
    let ref = new Date();

    let hr = ref.getHours();
    let mi = ref.getMinutes();
    mi = (mi < 10) ? '0' + mi : mi;
    let time = hr + ':' + mi;

    let dm = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(ref);
    let mn = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(ref);
    let yr = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(ref);

    document.getElementById('time').innerText = time;
    document.getElementById('date').innerText = dm + ' ' + mn + ' ' + yr;
    setTimeout(showTime, 1000);
}

async function getWeather () {
    const apiKey = '8adbb1fa691cf9ffeb5699685ae4c1bc'
    const cityID = 4612862
    const units = 'imperial'
    const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${apiKey}&units=${units}`)
    const response = await request.json()
    return response
}
async function getForecast () {
    const apiKey = '8adbb1fa691cf9ffeb5699685ae4c1bc'
    const cityID = 4612862
    const units = 'imperial'
    const request = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${apiKey}&units=${units}`)
    const response = await request.json()
    return response
}

function getTimeFromUnix(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    return hours + ':' + minutes.substr(-2)
}
function getDoWFromUnix(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
}
function getDoMFromUnix(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.getDate();
}
function getDateFromUnix(timestamp) {
    const ref = new Date(timestamp * 1000)
    let dm = new Intl.DateTimeFormat('en-US', {day: 'numeric'}).format(ref);
    let mn = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(ref);
    let yr = new Intl.DateTimeFormat('en-US', {year: 'numeric'}).format(ref);
    return dm + ' ' + mn + ' ' + yr;
}
function today() {
    return new Date().getDate()
}

function groupBy (xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
};

function getHigh(day) {
    return parseInt(
        Math.max.apply(
            Math, day.map(
                function(time) {
                    return time.main.temp_max
                }
            )
        )
    )
}
function getLow(day) {
    return parseInt(
        Math.min.apply(
            Math, day.map(
                function (time) {
                    return time.main.temp_min
                }
            )
        )
    )
}
function loadImage(image) {
    return new Promise(resolve => {
        image.src = image.dataset.src
        image.addEventListener('load', () => {
            resolve();
        })
    })
}
function genCal() {
    const day_of_week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const month_of_year = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const Calendar = new Date()

    const year = Calendar.getFullYear()
    const month = Calendar.getMonth()
    const today = Calendar.getDate()
    const weekday = Calendar.getDay()

    const DAYS_OF_WEEK = 7
    const DAYS_OF_MONTH = 31

    Calendar.setDate(1);    // Start the calendar day at '1'
    Calendar.setMonth(month);    // Start the calendar month at now


    /* VARIABLES FOR FORMATTING
    NOTE: You can format the 'BORDER', 'BGCOLOR', 'CELLPADDING', 'BORDERCOLOR'
          tags to customize your caledanr's look. */

    const TR_start = '<tr>';
    const TR_end = '</tr>';
    const highlight_start = '<td class=highlight>';
    const highlight_end = '</td>';
    const TD_start = '<td>';
    const TD_end = '</td>';

    let cal = "<table><thead><tr>" + 
                `<th colspan=${DAYS_OF_WEEK}>${month_of_year[month]} ${year}</th>` + 
                "</tr><tr>"

    //   DO NOT EDIT BELOW THIS POINT  //

    // LOOPS FOR EACH DAY OF WEEK
    for (index = 0; index < DAYS_OF_WEEK; index++) {

        // BOLD TODAY'S DAY OF WEEK
        if (weekday == index)
            cal += "<td class=highlight>" + day_of_week[index] + TD_end;

        // PRINTS DAY
        else
            cal += TD_start + day_of_week[index] + TD_end;
    }

    cal += TR_end;
    cal += '</thead><tbody>'
    cal += TR_start;

    // FILL IN BLANK GAPS UNTIL TODAY'S DAY
    for (index = 0; index < Calendar.getDay(); index++)
        cal += TD_start + '  ' + TD_end;

    // LOOPS FOR EACH DAY IN CALENDAR
    for (index = 0; index < DAYS_OF_MONTH; index++) {
        if (Calendar.getDate() > index) {
            // RETURNS THE NEXT DAY TO PRINT
            week_day = Calendar.getDay();

            // START NEW ROW FOR FIRST DAY OF WEEK
            if (week_day == 0)
                cal += TR_start;

            if (week_day != DAYS_OF_WEEK) {

                // SET VARIABLE INSIDE LOOP FOR INCREMENTING PURPOSES
                let day = Calendar.getDate();

                // HIGHLIGHT TODAY'S DATE
                if (today == Calendar.getDate())
                    cal += highlight_start + day + highlight_end + TD_end;

                // PRINTS DAY
                else
                    cal += TD_start + day + TD_end;
            }

            // END ROW FOR LAST DAY OF WEEK
            if (week_day == DAYS_OF_WEEK)
                cal += TR_end;
        }

        // INCREMENTS UNTIL END OF THE MONTH
        Calendar.setDate(Calendar.getDate() + 1);

    }// end for loop

    cal += '</td></tr><tbody></table>';

    return cal
}

function showCalendar() {
    document.body.classList.add('calendar')
    calendar.querySelector('.table').innerHTML = genCal();
}