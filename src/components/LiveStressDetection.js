import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LiveStressDetection = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [temperature, setTemperature] = useState(null);
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [stressLevel] = useState(4); // Hardcoded stress level for now

  useEffect(() => {
    // Start the video feed
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
        alert("Unable to access the camera. Please check your permissions.");
      }
    };

    startVideo();

    return () => {
      stopVideoStream();
    };
  }, []);

  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    // Update the current time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch temperature data from an API (using OpenWeatherMap for example)
    const fetchTemperature = async () => {
      try {
        const apiKey = 'YOUR_API_KEY';
        const city = 'YOUR_CITY_NAME'; // Replace with your preferred city
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        setTemperature(response.data.main.temp);
      } catch (error) {
        console.error("Error fetching temperature data: ", error);
      }
    };

    fetchTemperature();
  }, []);

  return (
    <div className="live-stress-detection-container">
      <div className="video-container">
        <video ref={videoRef} autoPlay muted width="800" height="600" />
      </div>
      <div className="stats-container">
        <h2>Live Stats</h2>
        <p>Current Time: {currentTime.toLocaleTimeString()}</p>
        <p>Time Zone: {timeZone}</p>
        <p>Stress Level: {stressLevel}</p>
        <p>Temperature: {temperature ? `${temperature}°C` : 'Loading...'}</p>
        <button
          onClick={() => {
            stopVideoStream(); // Stop the video feed before navigating back
            navigate(-1);
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default LiveStressDetection;
