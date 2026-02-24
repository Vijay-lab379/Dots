document.addEventListener("DOMContentLoaded", () => {
    //Grab all the elements
    const CityInput = document.getElementById('city-input')
    const GetWeatherBtn = document.getElementById('get-weather-btn')
    const WeatherInfo = document.getElementById('weather-info')
    const citydisplay = document.getElementById('city-name')
    const temp_display = document.getElementById('temperature')
    const weatherDiscreption = document.getElementById('description')
    const errorMessage = document.getElementById('error-message')
    const API_KEY = '5cac128d6fadb4ebb2b4d37ddcbce09c'//env varriables
    //Get Weather when propmted
    GetWeatherBtn.addEventListener('click', async () => {

        let city_name = CityInput.value.trim()
        if (!city_name) return

        // it may throw error
        // server/database is always in another contenent

        try {
            const weatherData = await Fetch_Weather_data(city_name)
            displayWeather(weatherData)
        } catch (error) {
            showError()
        }


    })

    async function Fetch_Weather_data(city_name) {
        //gets weather data
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}`
        const response = await fetch(url)
        if(!response.ok){
            throw new Error("City not Found")
        }

        const data = await response.json()
        return data
    }

    function displayWeather(weatherData) {
        //displays weather data
        //unlock the weather info
        WeatherInfo.classList.remove('hidden') 
        errorMessage.classList.add('hidden')
        const {name, main, weather} = weatherData
        citydisplay.textContent = name 
        temp_display.textContent = `Temperature: ${main.temp}`
        weatherDiscreption.textContent = `Weather: ${weather[0].description}`
        
    }

    function showError() {
        //shows error   
        WeatherInfo.classList.add('hidden')
        errorMessage.classList.remove('hidden')
    }
})