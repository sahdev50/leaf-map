import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LeafMap = () => {
  
    const mapRef = useRef(null);

    const [location, setLocation] = useState({
      latitude:null,
      longitude:null,
      granted:false
    })

    var options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };

      function success(pos) {
        var crd = pos.coords;
        setLocation({
          latitude: crd.latitude,
          longitude:crd.longitude,
          granted:true
        })
      }
    
      function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
    
      useEffect(() => {
        if (navigator.geolocation) {
          navigator.permissions
            .query({ name: "geolocation" })
            .then(function (result) {
              console.log(result);
              if (result.state === "granted") {
                //If granted then you can directly call your function here
                navigator.geolocation.getCurrentPosition(success, errors, options);
              } else if (result.state === "prompt") {
                //If prompt then the user will be asked to give permission
                navigator.geolocation.getCurrentPosition(success, errors, options);
              } else if (result.state === "denied") {
                //If denied then you have to show instructions to enable location
                alert("User denied access, now map will show sample location marker")
                const latitude = 51.505;
                const longitude = -0.09;
                setLocation({
                  latitude,
                  longitude
                })
              }
            });
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      }, []);

  
    if(location.latitude !== null){
      return ( 
        // Make sure you set the height and width of the map container otherwise the map won't show
          <MapContainer center={[location.latitude, location.longitude]} zoom={13} ref={mapRef} style={{height: "100vh", width: "100vw"}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
              <Marker position={[location.latitude, location.longitude]}>
                  <Popup>
                      {
                        location.granted ? "this is your current location not accurate enough" : "this is sample location"
                      }
                  </Popup>
              </Marker>
            {/* Additional map layers or components can be added here */}
          </MapContainer>
      );
    } else {
      return <div>Loading... waiting for location (Refresh)</div>
    }
  };
  
  export default LeafMap;