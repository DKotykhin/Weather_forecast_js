const btn = document.querySelector('#btn'),
    citySelector = document.querySelector('#city'),
    _appKey = '2e5e5a511f687e8d8ad9d60e5486dcc3',
    forecastDays = 5;

let timeZone, UpdateTime;


const CurrentWeather = (url) => {
    document.querySelectorAll('.row2>div').forEach(item => item.remove())
    fetch(url).then(response => response.json()).then(data => {
            const dc = data.current;
            citysel.innerHTML = citySelector.value;
            timeZone = data.timezone_offset / 3600;
            UpdateTime = moment.unix(dc.dt);
            getLocalDate();

            //console.log('Длительность дня: ' + new Date((dc.sunset - dc.sunrise) * 1000).toUTCString().slice(-12, -7));
            console.log('Длительность дня: ' + moment.unix(dc.sunset - dc.sunrise).utc().format('LT'));

            sunr.innerHTML = moment.unix(dc.sunrise).utc().add(timeZone, 'hours').format('LT');
            suns.innerHTML = moment.unix(dc.sunset).utc().add(timeZone, 'hours').format('LT');

            icon.innerHTML = `<img src=https://openweathermap.org/img/wn/${dc.weather[0]['icon']}@2x.png>`
            desc.innerHTML = dc.weather[0]['description'];

            temp.innerHTML = Math.round(dc.temp - 273);
            feel.innerHTML = Math.round(dc.feels_like - 273);
            pres.innerHTML = Math.round(dc.pressure / 1.3332);
            hum.innerHTML = dc.humidity;
            vis.innerHTML = dc.visibility / 1000;
            uvi.innerHTML = dc.uvi;
            clou.innerHTML = dc.clouds;
            wind.innerHTML = Math.round(dc.wind_speed);
            dir.innerHTML = WindDirect(dc.wind_deg);
            if (dc.wind_gust) gust.innerHTML = Math.round(dc.wind_gust);

            const nextDayForecast = (day) => {
                const nextDayForm = document.createElement('div'),

                    icon = `<img src="https://openweathermap.org/img/wn/${day.weather[0]['icon']}@2x.png">`,
                    description = day.weather[0]['description'],

                    dataDay = moment.unix(day.dt).format('DD MMMM'),
                    dayOfWeek = moment.unix(day.dt).format('dddd'),
                    tempDay = Math.round(day.temp.day - 273),
                    tempNight = Math.round(day.temp.night - 273),
                    presure = Math.round(day.pressure / 1.3332),
                    humidity = day.humidity,
                    windDirection = WindDirect(day.wind_deg),
                    windSpeed = Math.round(day.wind_speed),
                    clouds = day.clouds,
                    windGust = Math.round(day.wind_gust);
                if (!windGust) windGust = '';

                nextDayForm.innerHTML = `               
                <div class="col_center">
                    <p>${dayOfWeek} &nbsp<span>${dataDay}</span></p>
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

            for (let i = 1; i <= forecastDays; i++) {
                nextDayForecast(data.daily[i]);
            }

        })
        .catch(error => console.log('ошибка: ' + error));
}

const GetCoordinates = async(name) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${name}&appid=${_appKey}`
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

const getLocalDate = () => {
    if (timeZone) {
        tim.innerHTML = moment.utc().add(timeZone, 'hours').format('LTS');
        dat.innerHTML = moment.utc().add(timeZone, 'hours').format('dddd, DD MMMM');
        lastupd.innerHTML = moment(UpdateTime).startOf().fromNow();
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
        CurrentWeather(`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.lontitude}&lang=ru&appid=${_appKey}`);
    }
};