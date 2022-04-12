const btn = document.querySelector('#btn'),
    citySelector = document.querySelector('#city');

let timeZone; // = -new Date().getTimezoneOffset() / 60;


const CurrentWeather = (url) => {
    document.querySelectorAll('.row2>div').forEach(item => item.remove())
    fetch(url).then(response => response.json()).then(data => {

            citysel.innerHTML = citySelector.value;
            timeZone = data.timezone_offset / 3600;
            getLocalDate();

            const UpdateTime = new Date(data.current.dt * 1000);
            lastupd.innerHTML = UpdateTime.toLocaleTimeString().slice(0, -3)

            const sunriseHour = new Date(data.current.sunrise * 1000).getUTCHours() + timeZone;
            const sunriseMinutes = new Date(data.current.sunrise * 1000).getUTCMinutes();
            if (sunriseHour >= 24) sunr.innerHTML = `${sunriseHour-24}:${getZero(sunriseMinutes)}`;
            else sunr.innerHTML = `${sunriseHour}:${getZero(sunriseMinutes)}`;

            const sunsetHour = new Date(data.current.sunset * 1000).getUTCHours() + timeZone;
            const sunsetMinutes = new Date(data.current.sunset * 1000).getUTCMinutes();
            if (sunsetHour < 0) suns.innerHTML = `${sunsetHour+24}:${getZero(sunsetMinutes)}`;
            else suns.innerHTML = `${sunsetHour}:${getZero(sunsetMinutes)}`;

            icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.current.weather[0]['icon']}@2x.png">`
            desc.innerHTML = data.current.weather[0]['description'];

            temp.innerHTML = Math.round(data.current.temp - 273);
            feel.innerHTML = Math.round(data.current.feels_like - 273);
            pres.innerHTML = Math.round(data.current.pressure / 1.3332);
            hum.innerHTML = data.current.humidity;
            vis.innerHTML = data.current.visibility / 1000;
            uvi.innerHTML = data.current.uvi;
            clou.innerHTML = data.current.clouds;
            wind.innerHTML = Math.round(data.current.wind_speed);
            dir.innerHTML = WindDirect(data.current.wind_deg);
            if (data.current.wind_gust) gust.innerHTML = Math.round(data.current.wind_gust);

            const nextDayForecast = (day) => {
                const NextDay2 = new Date(data.daily[day].dt * 1000),
                    nextDayForm = document.createElement('div'),

                    icon = `<img src="https://openweathermap.org/img/wn/${data.daily[day].weather[0]['icon']}@2x.png">`,
                    description = data.daily[day].weather[0]['description'],

                    dataDay = NextDay2.toLocaleDateString(),
                    tempDay = Math.round(data.daily[day].temp.day - 273),
                    tempNight = Math.round(data.daily[day].temp.night - 273),
                    presure = Math.round(data.daily[day].pressure / 1.3332),
                    humidity = data.daily[day].humidity,
                    windDirection = WindDirect(data.daily[day].wind_deg),
                    windSpeed = Math.round(data.daily[day].wind_speed),
                    clouds = data.daily[day].clouds,
                    windGust = Math.round(data.daily[day].wind_gust);
                if (!windGust) windGust = '';

                nextDayForm.innerHTML = `               
                <div class="col_center">
                    <p>Прогноз на: &nbsp<span>${dataDay}</span></p>
                    <p>${icon}</p>
                    <p>${description}</p>
                </div>
                <table class="table">
                    <tr>
                        <td>Днём:</td>
                        <td><span>${tempDay}</span> °С</td>
                    </tr>
                    <tr>
                        <td>Ночью:</td>
                        <td><span>${tempNight}</span> °С</td>
                    </tr>
                    <tr>
                        <td>Давление:</td>
                        <td><span>${presure}</span> мм</td>
                    </tr>
                    <tr>
                        <td>Влажность:</td>
                        <td><span>${humidity}</span> %</td>
                    </tr>
                    <tr>
                        <td>Ветер:</td>
                        <td><span>${windDirection}</span></td>
                    </tr>
                    <tr>
                        <td>Скорость</td>
                        <td><span>${windSpeed}</span> м/с</td>
                    </tr>
                    <tr>
                        <td>Порывы до:</td>
                        <td><span>${windGust}</span> м/с</td>
                    </tr>
                    <tr>
                        <td>Облачность:</td>
                        <td><span>${clouds}</span> %</td>
                    </tr>
                </table>                
            `;
                document.querySelector('.row2').append(nextDayForm);
            }

            const forecastDays = 5;
            for (let i = 0; i < forecastDays; i++) {
                nextDayForecast(i + 1);
            }

        })
        .catch(error => console.log('ошибка: ' + error));
}

const GetCoordinates = async(name) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${name}&appid=2e5e5a511f687e8d8ad9d60e5486dcc3`
    let response = await fetch(url);
    let data = await response.json();
    let coords = {
        latitude: data[0].lat,
        lontitude: data[0].lon
    }
    return coords
}

const WindDirect = (degree) => {
    if (degree > 22.5 && degree < 67.5) return 'северо-восточный'
    else if (degree > 67.5 && degree < 112.5) return 'восточный'
    else if (degree > 112.5 && degree < 157.5) return 'юго-восточный'
    else if (degree > 157.5 && degree < 202.5) return 'южный'
    else if (degree > 202.5 && degree < 247.5) return 'юго-западный'
    else if (degree > 247.5 && degree < 292.5) return 'западный'
    else if (degree > 292.5 && degree < 337.5) return 'северо-западный'
    else return 'северный'
}

const getZero = (num) => {
    if (num >= 0 && num < 10) return `0${num}`;
    else return num;
}

const getLocalDate = () => {
    const localHours = new Date().getUTCHours() + timeZone,
        localMinutes = new Date().getUTCMinutes(),
        localSeconds = new Date().getUTCSeconds();
    const localDate = new Date().getDate(),
        localMonth = new Date().getMonth(),
        localYear = new Date().getFullYear();
    if (timeZone) {
        if (localHours >= 24) {
            tim.innerHTML = `${localHours-24}:${getZero(localMinutes)}:${getZero(localSeconds)}`
            dat.innerHTML = `${getZero(localDate + 1)}.${getZero(localMonth + 1)}.${localYear}`;
        } else if (localHours < 0) {
            tim.innerHTML = `${localHours+24}:${getZero(localMinutes)}:${getZero(localSeconds)}`
            dat.innerHTML = `${getZero(localDate - 1)}.${getZero(localMonth + 1)}.${localYear}`;
        } else {
            tim.innerHTML = `${localHours}:${getZero(localMinutes)}:${getZero(localSeconds)}`
            dat.innerHTML = `${getZero(localDate)}.${getZero(localMonth + 1)}.${localYear}`;
        }
    }
}

setInterval(() => getLocalDate(), 1000);

// setInterval(
//     () => CurrentWeather(),
//     60000
// );

btn.onclick = async(event) => {
    event.preventDefault();
    if (citySelector.selectedIndex) {

        console.log('Город: ' + citySelector.value);
        console.log('------------------------------------');

        let coords = await GetCoordinates(citySelector.value);
        CurrentWeather(`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.lontitude}&lang=ru&appid=2e5e5a511f687e8d8ad9d60e5486dcc3`);
    }
};