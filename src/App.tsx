import React, { useState, ChangeEvent, useEffect } from 'react';
import './App.css';
import Weather from './components/Weather';
import { Select, Modal, Button, Input, Card } from 'antd';

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [city, setCity] = useState<string>('');
  const [selectCity, setSelectCity] = useState();
  const [data, setData] = useState<any[]>([]);

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos: any) {
    var crd = pos.coords;
    localStorage.setItem('selectCity', crd);
    let temp = localStorage.getItem('selectCity');
  }

  function errors(err: any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    let temp = JSON.parse(localStorage.getItem('selectCity') || '{}');
    console.log('temp', temp);
    setSelectCity(temp);
    // if(!!temp) {
    //   setSelectCity(JSON.parse(temp));
    // }
    // setSelectCity(temp); 
    if (navigator.geolocation && localStorage.getItem('selectCity') === null) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    getWeather(city);
  };
  let getWeather = async (value: string) => {
        const api_url = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=ru`);
        const data = await api_url.json();
        setData(data.results);
  }
  return (
    <div className="App">
      <h1>Прогноз погоды</h1>
      <Button type="primary" onClick={showModal}>
        Выбрать город
      </Button>

      <Modal 
        title="Выбрать город" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}>
        <Input 
          type="text" 
          value={city} 
          onChange={handleChange}/>
        <div>
          {data?.map(item => {
            return <Card 
              onClick={() => {
                setSelectCity(item); 
                localStorage.setItem('selectCity', JSON.stringify(item));
              }} 
              hoverable 
              size='small' 
              style={{marginTop: 10}}>
              <div 
                style={{display: 'inline'}}>
                  <span>
                    {item.country}
                  </span> 
                  <span 
                    style={{marginLeft: 5}}>
                      {item.name}
                  </span>
              </div>
              <p>{item.admin1}</p>
            </Card>
          }
            
          )}
        </div>
      </Modal>

      <Weather city={selectCity}/>
    </div>
  );
}

export default App;
