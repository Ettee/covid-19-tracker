import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])
  useEffect(() => {
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
          .then((response) => response.json())
          .then((data) => {
            const countries = data.map((country) => ({
              name: country.country, 
              value: country.countryInfo.iso2 
            }));
            const sortedData = sortData(data);
            setTableData(sortedData);
            setMapCountries(data);
            setCountries(countries);
          });
      };
      getCountriesData()
      console.log('getCountriesData')
  }, []);
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        if(countryCode === 'worldwide'){
          setMapCenter(mapCenter);
          setMapZoom(mapZoom);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        };
      });
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <div className="app__title">
            <h1>COVID-19 Tracker</h1>
            <h3>Made by Ettee with <span role="img" aria-label="beating-heart">💓</span></h3>
          </div>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Thế giới</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType('cases')}
            title="Số ca mới hôm nay"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={e => setCasesType('recovered')}
            title="Số ca hồi phục hôm nay"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={e => setCasesType('deaths')}
            title="Số thương vong hôm nay"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map 
          casesType={casesType}
          countries={mapCountries} 
          center={mapCenter} 
          zoom={mapZoom} 
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3 className="app__rightTableTitle">Số ca nhiễm theo quốc gia</h3>
          <table>
            <tbody>
              <Table countries={tableData} />
            </tbody>
          </table>
              <h3 className="app__rightGraphTitle">Số ca {casesType === 'cases'? 'mới':casesType === 'recovered' ?'hồi phục':casesType === 'deaths'?'tử vong':''} trên thế giới</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>   
      </Card>
    </div>
  );
}

export default App;