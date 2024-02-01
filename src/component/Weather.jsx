import React, { useState, useEffect } from "react";

import { WiHumidity } from "react-icons/wi";
import { MdLocationPin, MdSearch } from "react-icons/md";
import { FaWind, FaRegCompass, FaTemperatureHigh } from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer} from "react-toastify";

const Weather = () => {
  const [location, setLocation] = useState("Delhi");
  const [displayLocation, setDisplayLocation] = useState("Delhi");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [nextdays,setnextdays]=useState(null)
  const [isCelsius, setIsCelsius] = useState(true);

  const apiKey = process.env.REACT_APP_API_KEY;
  const apiUrl = process.env.REACT_APP_BASE_URL;

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevIsCelsius) => !prevIsCelsius);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // If Enter key is pressed, submit the form
      fetchData();
    }
  };

  // getting icon image source
  const getIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  // getting daily weather data
  const fetchData = async () => {
    try {
      const unit = isCelsius ? "metric" : "imperial";
      setDisplayLocation(location)
      // Fetch current weather data
      const dailyResponse = await fetch(
        `${apiUrl}2.5/forecast?q=${location}&units=${unit}&appid=${apiKey}`
      );
      const dailyData = await dailyResponse.json();
      
      console.log(dailyData)

      const filteredDailyData = dailyData?.list?.filter((_, index) => (index+1) % 8 === 0);
      setnextdays(filteredDailyData)

      setHourlyData(dailyData?.list?.slice(0, 5))
      setWeatherData(dailyData?.list?.[0])
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
  
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCelsius]);
  

  return (
    <div className="weather-wrapper">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ background: "transparent" }}
      />

      {/* RIGHT SECTION START*/}
      <div className="right-section">
        {/* SEARCH BAR */}
        <div className="search-bar">
          <MdLocationPin color="white" />
          <input
            type="text"
            placeholder="Search for location"
            val={location}
            onKeyDown={handleKeyDown}
            onChange={(e) => {setLocation(e.target.value)}}
          />
          <MdSearch color="white"  onClick={() => fetchData()} />
        </div>

        {/* MAIN DETAILS */}
        <div className="main-details">
          {/* DIV FOR DETAILS */}
          <div className="text-details">
            <h1>{displayLocation}</h1>

            <div>
              <h1>
                {weatherData ? weatherData?.main?.temp : 31}
                {isCelsius ? "° C" : "° F"}
                <p>{weatherData?.weather?.[0]?.description}</p>
              </h1>
            </div>
          </div>
          {/* DIV FOR ICON */}
          <div className="icon-details">
            <img src={getIconUrl(weatherData?.weather?.[0].icon)} alt="icon" />
          </div>
        </div>

        {/* HOURLY DETAILS */}
        <div className="hourly-details">
          <h4>TODAY'S FORECAST</h4>
          <div className="hourly-details-wrapper">
            {hourlyData?.map((data, index) => (
              <div key={index}>
                <h6>
                  {new Date(data.dt * 1000).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </h6>
                <img
                  src={getIconUrl(data?.weather?.[0].icon)}
                  alt="icon"
                />
                <p>
                  {data.main.temp}
                  {isCelsius ? "° C" : "° F"}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* AIR CONDITIONS */}
        <div className="air-conditions">
          <h4>AIR CONDITIONS</h4>

          <div className="air-condition-details-wrapper">
            <div className="air-condition-details">
              <div className="air-condition-details-div">
                <WiHumidity />
                <div>
                  <h5>Humidity</h5>
                  <p>{weatherData ? weatherData?.main?.humidity : 77}</p>
                </div>
              </div>

              <div className="air-condition-details-div">
                <FaTemperatureHigh />
                <div>
                  <h5>Min/Max Temperature</h5>
                  <p>
                  {weatherData?.main?.temp_min}/{weatherData?.main?.temp_max}
                  </p>
                </div>
              </div>
            </div>

            <div className="air-condition-details">
              <div className="air-condition-details-div">
                <FaWind />
                <div>
                  <h5>Wind Speed</h5>
                  <p>{weatherData ? weatherData?.wind?.speed : 0}</p>
                </div>
              </div>

              <div className="air-condition-details-div">
                <FaRegCompass />
                <div>
                  <h5>Wind Direction</h5>
                  <p>{weatherData ? weatherData?.wind?.deg : 0}&deg;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* RIGHT SECTION END*/}

      {/* FARHENHEIGHT AND CELSIUS TOGGLE START */}
      <div className="toggle-container">
        <span
          className={`unit ${isCelsius ? "active" : ""}`}
          onClick={toggleTemperatureUnit}
        >
          °C
        </span>
        <span className="divider"> | </span>
        <span
          className={`unit ${!isCelsius ? "active" : ""}`}
          onClick={toggleTemperatureUnit}
        >
          °F
        </span>
      </div>
      {/* FARHENHEIGHT AND CELSIUS TOGGLE END */}

      {/* LEFT SECTION START*/}
      <div className="left-section">
        {/* HEADING */}
        <h4>Next 5-DAY FORECAST</h4>
        {/* FORECAST LIST */}
        <ul className="forecast-list">
        {nextdays?.map((day, index) => (
    <li key={index}>
      <h5>
        {new Date(day.dt * 1000).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })}
    </h5>
    <img src={getIconUrl(day.weather[0].icon)} alt="icon" />
    <p>{day.weather[0].description}</p>
    <p id="daily-temp">
      {day.main.temp}
      {isCelsius ? "° C" : "° F"}
    </p>
  </li>
))}

        </ul>
      </div>
      {/* LEFT SECTION START*/}
    </div>
  );
};

export default Weather;
