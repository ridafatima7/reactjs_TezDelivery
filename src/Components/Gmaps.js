import React, { useState, useEffect } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { LoadScript } from '@react-google-maps/api';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
}
from '@vis.gl/react-google-maps';
const Gmaps = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [open, setopen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);
  const [latitude, setLatitude] = useState(''); 
  const [longitude, setLongitude] = useState('');
  const [distance, setDistance] = useState('');

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition
            ({
              lat: latitude,
              lng: longitude
            });
            setLatitude(latitude.toFixed(6)); 
            setLongitude(longitude.toFixed(6))      
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };
    getLocation();
  }, []);
  const handleSearch = async () => {
    try {
      let api = 'AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU';
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchLocation)}&key=${api}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setMarkerPosition({ lat, lng });
        setCurrentPosition({ lat, lng });
        setLatitude(lat.toFixed(6)); 
        setLongitude(lng.toFixed(6));
        calculateDistance(lat, lng);
      }
      else {
        console.error('Location not found');
        console.log(searchLocation);
        console.log(data);
        console.log(response);
        console.log(currentPosition);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };
  const handleSelect = async (address) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      setCurrentPosition(latLng);
      setSearchLocation(address);
      setLatitude(latLng.lat.toFixed(6)); 
      setLongitude(latLng.lng.toFixed(6));
      calculateDistance(latLng.lat, latLng.lng);

    } catch (error) {
      console.error('Error selecting location:', error);
    }
  };
  const calculateDistance = (destLat, destLng) => {
    if (currentPosition) {
      const R = 6371; 
      const lat1 = currentPosition.lat;
      const lon1 = currentPosition.lng;
      const lat2 = destLat;
      const lon2 = destLng;

      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      setDistance(distance.toFixed(2)); 
    }
  };
  const position = {
    lat: 33.6844,
    lng: 73.0479
  };
  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey);
  const apiId = process.env.REACT_APP_API_URL;
  return (
    <div>
          <LoadScript googleMapsApiKey="AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU" libraries={['places']}>

      <APIProvider apiKey='AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU' >
        <div style={{ height: '100vh', width: '100%' }}>
          <Map zoom={14} center={currentPosition} mapId='f354a7d216f1686c'>
            {currentPosition && (
              <AdvancedMarker position={currentPosition} onClick={() => setopen(true)}>
                <Pin
                  background={'grey'}
                  borderColor={'green'}
                  glyphColor={'purple'} />
              </AdvancedMarker>
            )}
          </Map>
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
            <PlacesAutocomplete
              value={searchLocation}
              onChange={setSearchLocation}
              onSelect={handleSelect}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: 'Search Location',
                      className: 'map-search',
                    })}
                  />
                  <button className='map-search-button' onClick={handleSearch}>Search</button>
                  <label style={{marginLeft:'10px'}}>Latitude : </label>
                  <input type="text" style={{marginLeft:'5px'}} className='map-search' value={latitude} readOnly /> 
                  <label style={{marginLeft:'10px'}}>Longitude : </label>
                  <input type="text" style={{marginLeft:'5px'}} className='map-search' value={longitude} readOnly /><br />
                  {distance && (
                    <>
                      <label style={{ marginLeft: '10px' }}>Distance(km) : </label>
                      <input type="text" style={{ marginLeft: '5px',marginTop:'10px' }} className='map-search' value={distance} readOnly />
                    </>
                  )}
                  <div>
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const style = {
                        backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                      };
                      return (
                        <div {...getSuggestionItemProps(suggestion, { style })}>
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
        </div>
        {open && currentPosition && (
          <InfoWindow position={currentPosition}>
            <p>You are here</p>  
          </InfoWindow>
        )}
      </APIProvider>
      </LoadScript>
    </div>
  )
}

export default Gmaps
