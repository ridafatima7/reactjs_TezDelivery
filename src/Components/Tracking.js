import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TNavbar from './TNavbar';
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';
import api from "./apis";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { LoadScript } from '@react-google-maps/api';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import { Polyline } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { createOrder, getMarts } from '../Server';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef } from 'react'
import { FaLocationArrow } from "react-icons/fa";

const center = { lat: 48.8584, lng: 2.2945 }
const Tracking = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const [currentPosition, setCurrentPosition] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [martlatitude, setMartLatitude] = useState('');
  const [martlongitude, setMartLongitude] = useState('');
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU',
    // libraries: ['places'],
  })

  const [map, setMap] = useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const originRef = useRef();
  const destiantionRef = useRef();
  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    const directionsService = new window.google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }
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
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiId = process.env.REACT_APP_API_URL;
  useEffect(() => {
    axios.get('https://old.tezzdelivery.com/td_api_test/get_ordersList?customer_id=0xZxbVCWCjSiY2Q3CInBv4Cv6Kb2')
      .then(async response => {
        const data = response.data;
        if (data.status === 200 && data.data.length > 0) {
          const firstOrder = data.data[0];
          console.log(firstOrder);
          setOrderDetails(firstOrder);
          try {
            const martResponse = await axios.get(`${api}/get_marts?mart_id=${firstOrder.inventory_id}`);
            const martData = martResponse.data;
            if (martData.status === 200 && martData.data.length > 0) {
              const mart = martData.data[0];
              console.log("Mart Latitude:", mart.latitude);
              setMartLatitude(mart.latitude);
              console.log("Mart Longitude:", mart.longitude);
              setMartLongitude(mart.longitude);
            } else {
              console.log("No mart data found or API error occurred.");
            }
          } catch (error) {
            console.error("Error fetching mart details:", error);
          }
        } else {
          console.log("No orders found or API error occurred.");
        }
      })
      .catch(error => {
        setError("Error fetching orders: " + error);
        console.error("Error fetching orders:", error);
      });
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  const centerLat = (parseFloat(latitude) + parseFloat(martlatitude)) / 2;
  const centerLng = (parseFloat(longitude) + parseFloat(martlongitude)) / 2
  if (!currentPosition || !martlatitude || !martlongitude) {
    return <p>Loading map data...</p>;
  }
  const getOrdersList = async () => {
    try {
      const response = await fetch('https://old.tezzdelivery.com/td_api_web/get_ordersList?customer_id=0xZxbVCWCjSiY2Q3CInBv4Cv6Kb2');
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Failed to fetch orders list:', error);
    }
  };
  
  const getRiderLocation = async () => {
    try {
      const response = await fetch(`https://old.tezzdelivery.com/td_api_web/get_rider?rider_id=67d4754032f9cfbfdbd48ec7186d45`);
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Failed to fetch rider location:', error);
    }
  };
  
  // let riderIdCheckInterval = setInterval(async () => {
    // const ordersData = await getOrdersList();
    // const riderId = ordersData?.riderId;
     // Adjust this line based on how the riderId is actually returned in the orders data
  
    // if (riderId) {
      // clearInterval(riderIdCheckInterval);
      setInterval(async () => {
        const riderLocation = await getRiderLocation();
        console.log(riderLocation);
        console.log(riderLocation.data.latitude);

      }, 5000); 
    // }
  // }, 5000); 
  
  return (
    <div>
      <TNavbar />

      <GoogleMap
  mapContainerStyle={{ width: '100vw', height: '100vh' }}
  zoom={14}
  onLoad={(map) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(new window.google.maps.LatLng(currentPosition.lat, currentPosition.lng));
    bounds.extend(new window.google.maps.LatLng(parseFloat(martlatitude), parseFloat(martlongitude)));
    map.fitBounds(bounds);
  }}
>
  {currentPosition && (
    <>
      {console.log('current position  Latitude/long: is ', currentPosition)}
      <Marker position={currentPosition} />
    </>
  )} 
  {martlatitude && martlongitude && (
    <>
      {console.log('Mart Latitude: is ', martlatitude)}
      {console.log('Mart Longitude: is ', martlongitude)}
      <Marker position={{ lat: parseFloat(martlatitude), lng: parseFloat(martlongitude) }} />
    </>
  )}
  {currentPosition && martlatitude && martlongitude && (
    <Polyline
      path={[
        { lat: parseFloat(currentPosition.lat), lng: parseFloat(currentPosition.lng) },
        { lat: parseFloat(martlatitude), lng: parseFloat(martlongitude) }
      ]}
      options={{
        strokeColor: '#FFA500',
        strokeOpacity: 0.8,
        strokeWeight: 2
      }}
    />
  )}
  {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
</GoogleMap>


      {/* <div className='pt'>
        <APIProvider apiKey='AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU' className='pt'>
          <div style={{ height: '100vh', width: '100%' }}>
            <Map zoom={13}   center={{ lat: centerLat, lng: centerLng }} mapId='f354a7d216f1686c'>
              {currentPosition && (
                <AdvancedMarker position={currentPosition}>
                  <Pin background={'grey'} borderColor={'green'} glyphColor={'purple'} />
                </AdvancedMarker>
              )}
              {martlatitude && martlongitude && (
                <AdvancedMarker position={{ lat: parseFloat(martlatitude), lng: parseFloat(martlongitude) }}>
                  <Pin background={'orange'} /> 
                </AdvancedMarker>
              )}
              <Polyline
          path={[
            { lat: parseFloat(latitude), lng: parseFloat(longitude) },
            { lat: parseFloat(martlatitude), lng: parseFloat(martlongitude) }
          ]}
          options={{
            strokeColor: '#FFA500',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FFA500',
            fillOpacity: 0.35,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 30000,
            zIndex: 1000
          }}
              />
            </Map>
          </div>
        </APIProvider>
      </div> */}

      {/* <div className='pt' >
        <APIProvider apiKey='AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU' className='pt' >
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
          </div>
        </APIProvider>
      </div> */}
    </div>
  )
}

export default Tracking
