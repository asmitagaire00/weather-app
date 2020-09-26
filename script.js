import { config } from './config.js';

const submitBtn = document.getElementsByClassName("btn-submit")[0];
submitBtn.onclick = getWeather;

/**
 * Click Handler function. Fetches weather info when button is clicked.
 */
function getWeather(){
    const searchInput = document.getElementById("search-input");
    const loadingSpinner = document.getElementById("loading");
    const weatherInfoDiv = document.getElementById("weather-info");
    const API_KEY = config.weatherApiKey;
    console.log(API_KEY);
    let lat = 0;
    let lon = 0; 

    // clear the weather-info div
    weatherInfoDiv.innerHTML = "";

    // returns if not validated
    if(!validateSearchInput(searchInput.value)){
        loadingSpinner.innerHTML = 'Please enter city name. Do not inlcude numbers!';
        return;
    }

    const CITY_NAME = searchInput.value;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}`;
    searchInput.value = '';
   
    loadingSpinner.innerHTML = 'Loading...';

     fetch(url)
     .then(response =>{
         weatherInfoDiv.style.display = 'flex'; // show weather info div
         weatherInfoDiv.style.flexDirection = 'row';
         weatherInfoDiv.style.flexWrap = 'wrap';
         return response.json();
     })
     .then(weather => {
         console.log(weather.coord);
         lat = weather.coord.lat;
         lon = weather.coord.lon;
         const url1 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${API_KEY}`;
         
         fetch(url1)
         .then((res) => {
            loadingSpinner.innerHTML = ""; // make spinner hide
            return res.json();
         })
         .then((weatherInfo) => {
            
            console.log('jkbkbkjb',weatherInfo);
            let dailyTemps = [];
            let dailyIcons = [];

            // push current weather
            dailyTemps.push(Math.round(weatherInfo.current.temp));
            dailyIcons.push(weatherInfo.current.weather[0].icon);

            // push next 7 days weather starting tomorrow
            for(let i = 0; i<weatherInfo.daily.length; i++){
                dailyTemps.push(Math.round(weatherInfo.daily[i].temp.day));
                dailyIcons.push(weatherInfo.daily[i].weather[0].icon);
            }

            console.log(dailyTemps, dailyIcons);
            createWeatherInfoDiv(dailyTemps,dailyIcons);

         })
         .catch((err) => {
            loadingSpinner.innerHTML = 'Sorry, could not fetch the weather. Please enter city name properly.';
            console.log('Error while fetching: ', err);
         });

        })
     .catch(err=> {
        loadingSpinner.innerHTML = 'Sorry, could not fetch the weather. Please enter city name properly.';
        console.log('Error while fetching main: ', err);
    });

}


/**
 * Validates search input. Returns true if validated else false.
 */
function validateSearchInput(searchValue){
    // check if searchValue is text or not    
    return !/\d/.test(searchValue) && searchValue.length !== 0;
}

function createWeatherInfoDiv(weatherData, weatherIcons){

    weatherData.map((weather, i)=>{
        let tempDiv, imgDiv, newP, newImg;

        tempDiv = document.createElement("div");
        tempDiv.className = "temp-div"

        i===0 ? tempDiv.style.backgroundColor = "#aebbc1" : tempDiv.style.backgroundColor = "#e0e0e0";
        tempDiv.style.display = "inline-block"; 
        tempDiv.style.margin = "10px 10px";
        tempDiv.style.padding = "0px 10px";
        
        imgDiv = document.createElement("div");
        
        newImg = document.createElement("img");
        newImg.src = `http://openweathermap.org/img/wn/${weatherIcons[i]}@2x.png`;
        newImg.style.width = "50px";
        newImg.style.height = "50px";

        newP = document.createElement("p");
        newP.style.margin = "0px 0px";
        newP.appendChild(document.createTextNode(weather + "\u00B0" + 'C'));

        imgDiv.appendChild(newImg);
        tempDiv.appendChild(imgDiv);
        tempDiv.appendChild(newP);
        document.getElementById("weather-info").appendChild(tempDiv);
    })

}
