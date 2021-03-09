const wifiFrame = document.querySelector('#wifiFrame')
const wifiBtn = document.querySelector('#wifiBtn')
const wifi = document.querySelector('#wifi')
let background = document.querySelector('#background')

setInterval(changeBackground,600000)
showTime()
document.body.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('clicked')
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

function changeBackground() {
    const index = Math.floor(Math.random() * Math.floor(files.length))
    const fileName = files[index]
    console.log(fileName)
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
    bg.src = './art/' + fileName
    bg.addEventListener(load, () => {
        background.parentNode.replaceChild(bg,background)
        background = document.querySelector('#background')
        console.log('loaded')
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
