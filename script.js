const wifiFrame = document.querySelector('#wifiFrame')
const wifiBtn = document.querySelector('#wifiButton button')
const wifi = document.querySelector('#wifi')
const weatherEl = document.querySelector('#weather')
const forecastEl = document.querySelector('#forecast')
const weatherIcon = document.querySelector('#icon > img')
const shortDesc = document.querySelector('#icon > div')
const temp =  document.querySelector('#temp')
const riseTime =  document.querySelector('#rise')
const setTime =  document.querySelector('#set')
let background = document.querySelector('#background')

changeBackground()
showTime()
weather()

setInterval(changeBackground,600000)
setInterval(weather,3600000)

document.body.addEventListener('click', (e) => {
    e.stopPropagation();
    changeBackground()
})
wifiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    wifiFrame.classList.add('visible');
})
wifiFrame.addEventListener('click', (e) => {
    e.stopPropagation();
    wifiFrame.classList.remove('visible');
})
wifi.addEventListener('click', (e) => {
    e.stopPropagation();
})
weatherEl.addEventListener('click', (e) => {
    e.stopPropagation();
    forecast()
})
forecastEl.addEventListener('click', (e) => {
    e.stopPropagation();
})

function weather() {
    getWeather().then((weather) => {
        weatherIcon.src = `weather/${weather.weather[0].icon}.png`
        shortDesc.innerText = weather.weather[0].main
        temp.innerText = `${parseInt(weather.main.temp)}°F`
        riseTime.innerText = `Sunrise: ${getTimeFromUnix(weather.sys.sunrise)}`
        setTime.innerText = `Sunset: ${getTimeFromUnix(weather.sys.sunset)}`
    }) 
}
function forecast() {
    getForecast().then((forecast) => {
        let HTML = ""
        let details = `
<div class="details">`
        forecast.list.forEach((time) => time.day_of_month = getDoMFromUnix(time.dt))
        const days = groupBy(forecast.list, 'day_of_month')
        for (const day in days) {
            const current = days[day]
            HTML += `
<div class="day">
    <div class="date">${(parseInt(day) === today()) ? "Today" : getDoWFromUnix(current[0].dt)}</div>
    <img class="icon" src="weather/${current[parseInt(current.length/2)].weather[0].icon}.png">
    <div class="description">${current[parseInt(current.length/2)].weather[0].main}</div>
    <div class="temprange">
        <div class="low">${getLow(current)}°</div>
        <div class="gradient"></div>
        <div class="high">${getHigh(current)}°</div>
    </div>
    <button class="expand" data-day="${day}">Details</button>`
            details += `
    <div class="day" data-day=${day}>`
            for(const time of days[day]) {
                time.date = getDateFromUnix(time.dt)
                time.time = getTimeFromUnix(time.dt)
                details += `   
        <div class="chunk">
            <div class="time">${time.time}</div>
            <div class="temp">${parseInt(time.main.temp)}°F</div>
            <img class="icon" src="weather/${time.weather[0].icon}.png">
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
        HTML += `
<button id="exitForecast">
    <img src="close.svg" />
</button>`
        forecastEl.innerHTML = HTML + details
        const expanders = forecastEl.querySelectorAll('button.expand')
        for (const each of expanders) {
            each.addEventListener('click', () => {
                console.log(each.dataset.day)
                const tabs = document.querySelectorAll('.expand')
                for (const tab of tabs) {
                    tab.classList.remove('active')
                }
                const details = document.querySelectorAll('.details .day.visible')
                for (detail of details) {
                    detail.classList.remove('visible')
                }
                
                each.classList.add('active')
                console.log(document.querySelector(`.details [data-day="${each.dataset.day}"]`))
                document.querySelector(`.details .day[data-day="${each.dataset.day}"]`).classList.add('visible')
                forecastEl.classList.add('details')
            })
        }
        forecastEl.querySelector('#exitForecast').addEventListener('click', () => {
            forecastEl.classList = ''
            setTimeout(() => {
                forecastEl.innerHTML = ''
            }, 300)
        })
        forecastEl.classList.add('visible')
    })
}

function changeBackground() {
    const index = Math.floor(Math.random() * Math.floor(fileList.length))
    const fileName = fileList[index]
    let bg,load
    if (fileName.includes('.mp4')) {
        bg = document.createElement('video')
        bg.loop = true
        bg.controls = false
        bg.muted = true
        bg.autoplay = true
        load = 'loadeddata'
    } else {
        bg = document.createElement('img')
        load = 'load'
    }
    bg.id = 'background'
    bg.src = 'art/' + fileName
    bg.addEventListener(load, () => {
        background.parentNode.replaceChild(bg,background)
        background = document.querySelector('#background')
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
    return parseInt(Math.max.apply(Math,day.map(function(time){return time.main.temp_max;})))
}
function getLow(day) {
    return parseInt(Math.min.apply(Math,day.map(function(time){return time.main.temp_max;})))
}
function details(day) {
    
}