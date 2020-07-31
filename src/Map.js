import React from 'react';
import "./Map.css";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from './util';


function Map({ countries, casesType, center, zoom }) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
            <p style={{color:"gray",fontSize:"13px"}}>Map đôi khi sẽ định vị sai vị trí của quốc gia do tọa độ lấy vể từ https://disease.sh/</p>
        </div>
    );
}

export default Map;
