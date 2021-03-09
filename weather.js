async function getWeather () {
    const apiKey = '8adbb1fa691cf9ffeb5699685ae4c1bc'
    const cityID = 4612862
    const units = 'imperial'
    const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${apiKey}&units=${units}`)
    const response = await request.json()
    return response
}