const wifiFrame = document.querySelector('#wifiFrame')
const wifiBtn = document.querySelector('#wifiBtn')
const wifi = document.querySelector('#wifi')
const weatherIcon = document.querySelector('#icon > img')
const shortDesc = document.querySelector('#icon > div')
const temp =  document.querySelector('#temp')
const riseTime =  document.querySelector('#rise')
const setTime =  document.querySelector('#set')
let background = document.querySelector('#background')

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

function weather() {
    getWeather().then((weather) => {
        weatherIcon.src = `weather/${weather.weather[0].icon}.png`
        shortDesc.innerText = weather.weather[0].main
        temp.innerText = `${parseInt(weather.main.temp)}°F`
        riseTime.innerText = `Sunrise: ${getTimeFromUnix(weather.sys.sunrise)}`
        setTime.innerText = `Sunset: ${getTimeFromUnix(weather.sys.sunset)}`
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

function getTimeFromUnix(time) {
    let unix_timestamp = time
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2)
}