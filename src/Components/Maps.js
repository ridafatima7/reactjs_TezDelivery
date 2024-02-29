import React,{useState} from 'react'
// import {GoogleApiWrapper} from 'google-maps-react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
}
from '@vis.gl/react-google-maps';
const Maps = () => {
    const position={lat: 33.6844,
      lng: 73.0479};
    const apiKey = process.env.REACT_APP_API_KEY;
    console.log(apiKey);
    const apiId = process.env.REACT_APP_API_URL;
    const [open,setopen]=useState(false); 
  return (
    <div>
      <APIProvider apiKey='AIzaSyA_miDifPCOd3dAu3WUms7GeCMRYMVSRz4'>
      {/* <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}></APIProvider> */}
        <div style={{height:'100vh',width:'216vh'}}>
            <Map zoom={9} center={position} mapId='f354a7d216f1686c'>
                <AdvancedMarker position={position} onClick={()=>setopen(true)}>
                    <Pin 
                      background={'grey'}
                      borderColor={'green'}
                      glyphColor={'purple'}
                    />
                </AdvancedMarker>
            </Map>
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
            <input className='map-search' placeholder='Search Location' type="text"  />
            <button className='map-search-button' >Search</button>
          </div>
        </div>
        {open && (
           <InfoWindow position={position}>
            <p>Im at Islamabad</p>
           </InfoWindow>
        )}
      </APIProvider>
    </div>
  )
}

export default Maps