/*
 * _______________#########_______________________ 
 * ______________############_____________________ 
 * ______________#############____________________ 
 * _____________##__###########___________________ 
 * ____________###__######_#####__________________ 
 * ____________###_#######___####_________________ 
 * ___________###__##########_####________________ 
 * __________####__###########_####_______________ 
 * ________#####___###########__#####_____________ 
 * _______######___###_########___#####___________ 
 * _______#####___###___########___######_________ 
 * ______######___###__###########___######_______ 
 * _____######___####_##############__######______ 
 * ____#######__#####################_#######_____ 
 * ____#######__##############################____ 
 * ___#######__######_#################_#######___ 
 * ___#######__######_######_#########___######___ 
 * ___#######____##__######___######_____######___ 
 * ___#######________######____#####_____#####____ 
 * ____######________#####_____#####_____####_____ 
 * _____#####________####______#####_____###______ 
 * ______#####______;###________###______#________ 
 * ________##_______####________####______________ 
 * 
 * @Author: 崩布猪
 * @Date: 2024-08-15 15:21:08
 * @LastEditors: 崩布猪
 * @LastEditTime: 2024-08-18 14:57:19
 * @FilePath: \web\part2 work\Data-for-countries\src\App.jsx
 * @Description: 
 * 
 */

import { useState, useEffect } from 'react'
import axios from "axios";
const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Too many matches,specify another filter</p>
  } else if (countries.length <= 10 && countries.length > 1) {

    return (
      countries.map((commonName) => {
        return (
          <div key={commonName.cca2}>
            < strong >{commonName.name.common} </strong>
            <ButtonClick countyBase={commonName} />

          </div>)
      })
    )
  }
  else if (countries.length === 1) {
    return <County countyBase={countries[0]} />
  }
}

const County = ({ countyBase }) => {

  // 国家语言
  const languages = [];
  if (countyBase.languages && typeof countyBase.languages === 'object') {
    for (let prop in countyBase.languages) {
      if (countyBase.languages.hasOwnProperty(prop)) {
        languages.push(
          <p key={prop}>
            {countyBase.languages[prop]}
          </p>
        );
      }
    }
  }
  console.log(countyBase.capitalInfo);

  return (
    <div >
      <h2>{countyBase.name.common}</h2>
      <p>{countyBase.capital}</p>
      <p>area {countyBase.area}</p>
      <h2>languages</h2>
      {languages}
      <img src={countyBase.flags.svg} alt={countyBase.flags.alt} />


      <Weather capitalInfo={countyBase.capitalInfo} capital={countyBase.capital} />
    </div>
  )
}

const ButtonClick = ({ countyBase }) => {
  const [showAll, setShowAll] = useState(false)
  const toggleShow = () => {
    setShowAll(!showAll);
  };
  return (
    <>
      <button onClick={toggleShow}>
        {showAll ? 'show' : 'Hide'}
      </button>
      {showAll && <County countyBase={countyBase} />}
    </>

  )
}

const Weather = ({ capital, capitalInfo }) => {
  const [weat, setWeather] = useState(null)
  
  useEffect(() => {
    if (!capitalInfo) return;
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${capitalInfo.latlng[0]}&lon=${capitalInfo.latlng[1]}&units=metric&lang=zh_cn&appid=7b561b43a3e8e3e9679768af42fa76b7`)
      .then(response => {
        console.log('response',response);
        setWeather(response.data)
      })
  },[capitalInfo])
  if (!weat) {  
    return <div>Loading weather...</div>; // 如果天气数据未加载，显示加载中  
  } 
  console.log('Weather', weat);
  const we = weat.weather[0]
  const src = `https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${we.icon}.png`

  console.log(src);


  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>今日天气 <b> {we.description} </b>  温度<b>{weat.main.temp}℃</b></p>
      <img src={src} />
    </div>
  )
}
function App() {
  const [countries, setCountries] = useState([])
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    console.log('effect');
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
  }


  const handleSearchNameChange = event => setSearchName(event.target.value)
  const PhoneobookToShow = (countries.filter(commonName => {
    const regex = new RegExp(searchName, 'i');
    return regex.test(commonName.name.common);
  }))
  return (
    <>
      <>
        <form onSubmit={addNote} >
          <div>
            find countries: <input
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </div>
          <div>
            <Countries countries={PhoneobookToShow} />
          </div>
        </form>
      </>

    </>
  )
}

export default App
