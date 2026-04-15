// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DetailView from './components/DetailView';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [apodData, setApodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from NASA APOD API
  useEffect(() => {
    const fetchApodData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiKey = 'bWx1ZuROtL64fxbI7JMwAebxNf0PANDntEz2zWcP';
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=20`
        );
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setApodData(data);
        } else {
          throw new Error('No data received from API');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to fetch data from NASA API');
        setApodData(getSampleData());
      } finally {
        setLoading(false);
      }
    };

    fetchApodData();
  }, []);

  const getSampleData = () => {
    return [
      {
        title: "The Milky Way Over Mountains",
        date: "2024-03-15",
        explanation: "A breathtaking view of our galaxy stretching across the night sky above mountain peaks. The Milky Way's core is visible with its billions of stars creating a luminous band across the heavens.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2403/MilkyWay_Steed_960.jpg",
        copyright: "John Smith",
        hdurl: "https://apod.nasa.gov/apod/image/2403/MilkyWay_Steed_960.jpg",
        service_version: "v1"
      },
      {
        title: "A Total Solar Eclipse",
        date: "2024-04-08",
        explanation: "The Sun's corona during the total solar eclipse, revealing intricate plasma structures and solar flares. This rare event occurs when the Moon perfectly aligns between Earth and the Sun.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2404/EclipseCorona_Seip_960.jpg",
        copyright: "Sarah Johnson",
        hdurl: "https://apod.nasa.gov/apod/image/2404/EclipseCorona_Seip_960.jpg",
        service_version: "v1"
      },
      {
        title: "Jupiter and Its Moons",
        date: "2024-02-20",
        explanation: "The gas giant Jupiter with three of its Galilean moons visible in this telescopic view. Europa, Ganymede, and Callisto orbit the largest planet in our solar system.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2402/JupiterMoons_Tezel_960.jpg",
        copyright: "Michael Brown",
        hdurl: "https://apod.nasa.gov/apod/image/2402/JupiterMoons_Tezel_960.jpg",
        service_version: "v1"
      },
      {
        title: "Aurora Over Norway",
        date: "2024-03-01",
        explanation: "Green auroral curtains dance across the Arctic sky in this time-lapse composite. The Northern Lights occur when solar particles interact with Earth's magnetic field.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2403/AuroraNorway_Strange_960.jpg",
        copyright: "Emma Wilson",
        hdurl: "https://apod.nasa.gov/apod/image/2403/AuroraNorway_Strange_960.jpg",
        service_version: "v1"
      },
      {
        title: "The Orion Nebula",
        date: "2024-01-10",
        explanation: "Star formation in the Great Nebula of Orion, captured by the Hubble Space Telescope. This stellar nursery is located 1,344 light-years away and is visible to the naked eye.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2401/OrionNebula_Hubble_960.jpg",
        copyright: "NASA/ESA",
        hdurl: "https://apod.nasa.gov/apod/image/2401/OrionNebula_Hubble_960.jpg",
        service_version: "v1"
      },
      {
        title: "Space Station Transit",
        date: "2024-02-05",
        explanation: "The International Space Station crossing in front of the Sun in this high-speed video. The transit lasted only 0.6 seconds as the station orbited at 17,500 mph.",
        media_type: "video",
        url: "https://www.youtube.com/embed/f0Sc1TqV5sQ",
        copyright: "NASA",
        service_version: "v1"
      },
      {
        title: "Andromeda Galaxy",
        date: "2023-12-15",
        explanation: "Our neighboring spiral galaxy, 2.5 million light-years away, showing its beautiful structure. Andromeda is on a collision course with the Milky Way.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2312/Andromeda_Hubble_960.jpg",
        copyright: "NASA/ESA",
        hdurl: "https://apod.nasa.gov/apod/image/2312/Andromeda_Hubble_960.jpg",
        service_version: "v1"
      },
      {
        title: "Mars Rover Panorama",
        date: "2024-01-25",
        explanation: "A 360-degree view of the Martian surface from NASA's Perseverance rover. The image shows ancient river delta deposits and the distant rim of Jezero Crater.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2401/MarsPanorama_Curiosity_960.jpg",
        copyright: "NASA/JPL-Caltech",
        hdurl: "https://apod.nasa.gov/apod/image/2401/MarsPanorama_Curiosity_960.jpg",
        service_version: "v1"
      },
      {
        title: "Solar Flare Eruption",
        date: "2024-03-20",
        explanation: "A powerful X-class solar flare captured by the Solar Dynamics Observatory. This eruption released energy equivalent to millions of hydrogen bombs.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2403/SolarFlare_SDO_960.jpg",
        copyright: "NASA/SDO",
        hdurl: "https://apod.nasa.gov/apod/image/2403/SolarFlare_SDO_960.jpg",
        service_version: "v1"
      },
      {
        title: "Night Sky Timelapse",
        date: "2024-04-01",
        explanation: "Stars rotating around the celestial pole in this stunning night photography composite. The image shows Earth's rotation over several hours.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2404/StarTrails_Anderson_960.jpg",
        copyright: "Robert Anderson",
        hdurl: "https://apod.nasa.gov/apod/image/2404/StarTrails_Anderson_960.jpg",
        service_version: "v1"
      },
      {
        title: "Saturn's Rings",
        date: "2023-11-30",
        explanation: "The Cassini spacecraft's final view of Saturn's intricate ring system. The rings are composed of billions of ice particles ranging from tiny grains to mountain-sized chunks.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2311/Saturn_Cassini_960.jpg",
        copyright: "NASA/JPL-Caltech/SSI",
        hdurl: "https://apod.nasa.gov/apod/image/2311/Saturn_Cassini_960.jpg",
        service_version: "v1"
      },
      {
        title: "Pillars of Creation",
        date: "2024-02-10",
        explanation: "The iconic Pillars of Creation in the Eagle Nebula, reimagined by the James Webb Space Telescope. These cosmic pillars are incubators for new stars.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2402/PillarsWebb_960.jpg",
        copyright: "NASA/ESA/CSA",
        hdurl: "https://apod.nasa.gov/apod/image/2402/PillarsWebb_960.jpg",
        service_version: "v1"
      }
    ];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cosmic wonders from NASA...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard data={apodData} error={error} />} />
          <Route path="/item/:itemId" element={<DetailView data={apodData} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;