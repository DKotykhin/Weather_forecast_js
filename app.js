//let selectURL;

const CurrentWeather = (selectURL) => {
    document.querySelectorAll('.row2>div').forEach(item => item.remove())
    fetch(selectURL).then(response => response.json()).then(data => {

            const UpdateTime = new Date(data.current.dt * 1000);
            lastupd.innerHTML = UpdateTime.toLocaleTimeString().slice(0, -3)
            const SunriseTime = new Date(data.current.sunrise * 1000);
            sunr.innerHTML = SunriseTime.toLocaleTimeString().slice(0, -3);
            const SunsetTime = new Date(data.current.sunset * 1000);
            suns.innerHTML = SunsetTime.toLocaleTimeString().slice(0, -3)

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
            const forecastArray = [1, 2, 3, 4, 5];
            forecastArray.forEach(item => nextDayForecast(item));
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

const getCurrentTimeString = () => {
    return new Date().toLocaleTimeString();
}
const getCurrentDateString = () => {
    return new Date().toLocaleDateString();
}
console.log('Дата: ' + getCurrentDateString());
console.log('Время: ' + getCurrentTimeString());

setInterval(
    () => tim.innerHTML = getCurrentTimeString(),
    dat.innerHTML = getCurrentDateString(),
    1000
);
// setInterval(
//     () => CurrentWeather(),
//     60000
// );

const btn = document.querySelector('#btn');
btn.onclick = async(event) => {
    event.preventDefault();
    if (document.getElementById('city').selectedIndex) {

        console.log('Город: ' + city.value);
        console.log('------------------------------------');

        citysel.innerHTML = city.value;
        let coords = await GetCoordinates(city.value);
        const selectURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.lontitude}&lang=ru&appid=2e5e5a511f687e8d8ad9d60e5486dcc3`
        CurrentWeather(selectURL);
    }
};