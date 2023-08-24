import React, {useState, useEffect} from 'react';
import { Card, Collapse } from 'antd';
import wind from '../img/icons/wind.png';
import gauge from '../img/icons/gauge.png';
import humidity from '../img/icons/humidity.png';
import cloud from '../img/icons/cloud.png';
import uvindex from '../img/icons/uv-index.png';

function Weather(city: any) {

  const [data, setData] = useState();
  const [temp] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [temp2] = useState({
    0: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    1: [24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47],
    2: [48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71],
    3: [72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95],
    4: [96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119],
    5: [120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143],
    6: [144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167],
  });
  const [dayIndex, setDayIndex] = useState<number>(0);
  const [dailyWeather, setDailyWeather] = useState({
    precipitation_sum: [],
    shortwave_radiation_sum: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    time: [],
    weathercode: [],
    windspeed_10m_max: []
  });
  const [hourlyWeather, setHourlyWeather] = useState({
    apparent_temperature: [],
    cloudcover: [],
    direct_radiation: [],
    precipitation: [],
    pressure_msl: [],
    relativehumidity_2m: [],
    temperature_2m: [],
    time: [],
    weathercode: [],
    windspeed_10m: []
  });
  const [current_weather, setCurrent] = useState({
    is_day: '',
    temperature: '',
    time: '',
    weathercode: '',
    winddirection: '',
    windspeed: ''
  });
  const [dailyUnits, setDailyUnits] = useState({
    precipitation_sum: 'мм',
    shortwave_radiation_sum: 'мДж/м²',
    temperature_2m_max: '°C',
    windspeed_10m_max: 'км/ч'
  });
  const [hourlyUnits, setHourlyUnits] = useState({
    apparent_temperature: '°C',
    cloudcover: '%',
    direct_radiation: 'Вт/м²',
    precipitation: 'мм',
    pressure_msl: 'гПа',
    relativehumidity_2m: '%',
    temperature_2m: '°C',
    windspeed_10m: 'км/ч'
  })

  let getWeather = async () => {
    const api_url = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.city?.latitude}&longitude=${city.city?.longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,cloudcover,direct_radiation,windspeed_10m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,shortwave_radiation_sum&timezone=${city.city?.timezone}&current_weather=true
    `);
    const data = await api_url.json();
    setData(data);
    setCurrent(data.current_weather);
    setDailyWeather(data.daily);
    setHourlyWeather(data.hourly);
    localStorage.setItem('currentWeather', JSON.stringify(data.current_weather));
}

  useEffect(() => {
    getWeather();
  }, [city]);

  return (
    <div>
      {current_weather ? <Collapse
      defaultActiveKey={['1']}
      style={{marginTop: 30}}
      size="large"
      items={[{ key: '1', label: 'Погода сейчас', children: <div>
      <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
        <h2>Погода сейчас</h2>
        <h3>{new Date(current_weather?.time).toLocaleDateString("ru-RU", {day: 'numeric', month: 'numeric', year: 'numeric', weekday: 'long'})+', '+new Date(current_weather?.time).toLocaleTimeString("ru-RU")}</h3>
          <span><img src={uvindex} className='icons'/> {current_weather?.temperature} {dailyUnits?.temperature_2m_max}</span>
          <span><br/><img src={cloud} className='icons'/> Код погоды - {current_weather?.weathercode}</span>
          <span><br/><img src={wind} className='icons'/> Направление ветра - {current_weather?.winddirection}</span>
          <span><br/><img src={wind} className='icons'/> Скорость ветра - {current_weather?.windspeed} {dailyUnits?.windspeed_10m_max}</span>
           
        
      </div>
    </div> }]}
    />: ''}

    {dailyWeather ? <Collapse
      defaultActiveKey={['2']}
      size="large"
      items={[{ key: '2', label: 'Прогноз погоды по дням', children: <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
      <h2>Прогноз погоды по дням</h2>
      <div style={{display: 'flex', flex: '1', flexWrap: 'wrap', justifyContent: 'center'}}>
          {temp.map(index => {
            return <div style={{minWidth: 200, margin: 5}}>
              <Card hoverable className='Weather-Card' onClick={() => setDayIndex(index)} title={new Date(dailyWeather?.time[index]).toLocaleDateString("ru-RU", {day: 'numeric', month: 'numeric', year: 'numeric', weekday: 'long'})}>        
                <span>Сумма осадков - {dailyWeather?.precipitation_sum[index]} {dailyUnits?.precipitation_sum}</span>
                <span><br/>Коротковолновое излучение - {dailyWeather?.shortwave_radiation_sum[index]} {dailyUnits?.shortwave_radiation_sum}</span>
                <span><br/><img src={uvindex} className='icons'/> Макс. температура - {dailyWeather?.temperature_2m_max[index]} {dailyUnits?.temperature_2m_max}</span>
                <span><br/><img src={uvindex} className='icons'/> Мин. температура - {dailyWeather?.temperature_2m_min[index]} {dailyUnits?.temperature_2m_max}</span>
                <span><br/><img src={cloud} className='icons'/> Код погоды - {dailyWeather?.weathercode[index]}</span>
                <span><br/> <img src={wind} className='icons'/> Макс. скорость ветра - {dailyWeather?.windspeed_10m_max[index]} {dailyUnits?.windspeed_10m_max}</span>
              </Card>
            </div>
          })}
        </div>
    </div> }]}
    />: ''}

    {hourlyWeather ? <Collapse
      defaultActiveKey={['3']}
      size="large"
      items={[{ key: '3', label: 'Прогноз погоды по часам', children: <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
      <h2>Прогноз погоды по часам</h2>
      <div style={{display: 'flex', flex: '1', flexWrap: 'wrap', justifyContent: 'center'}}>
      {temp2[dayIndex as keyof typeof temp2].map(index => {
        return <div style={{minWidth: 200, margin: 5}}>
          <Card className='Weather-Card' title={new Date(hourlyWeather?.time[index]).toLocaleDateString("ru-RU")+', '+new Date(hourlyWeather?.time[index]).toLocaleTimeString("ru-RU", {hour: '2-digit', minute:'2-digit'})}>        
            <span><img src={uvindex} className='icons'/> Ощущаемая температура - {hourlyWeather?.apparent_temperature[index]} {hourlyUnits?.apparent_temperature}</span>
            <span><br/><img src={cloud} className='icons'/> Облачность - {hourlyWeather?.cloudcover[index]} {hourlyUnits?.cloudcover}</span>
            <span><br/>Прямое излучение - {hourlyWeather?.direct_radiation[index]} {hourlyUnits?.direct_radiation}</span>
            <span><br/>Осадки - {hourlyWeather?.precipitation[index]} {hourlyUnits?.precipitation}</span>
            <span><br/><img src={gauge} className='icons'/> Давление - {hourlyWeather?.pressure_msl[index]} {hourlyUnits?.pressure_msl}</span>
            <span><br/><img src={humidity} className='icons'/> Относительная влажность - {hourlyWeather?.relativehumidity_2m[index]} {hourlyUnits?.relativehumidity_2m}</span>
            <span><br/><img src={uvindex} className='icons'/> Температура - {hourlyWeather?.temperature_2m[index]} {hourlyUnits?.temperature_2m}</span>
            <span><br/><img src={cloud} className='icons'/> Код погоды - {hourlyWeather?.weathercode[index]}</span>
            <span><br/><img src={wind} className='icons'/> Скорость ветра - {hourlyWeather?.windspeed_10m[index]} {hourlyUnits?.windspeed_10m}</span>
          </Card>
        </div>
      })}
    </div>
  </div> }]}
    />: ''}
    </div>
  );
}

export default Weather;
