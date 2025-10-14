import {getValutes} from "./api.js";
import {useEffect, useRef, useState} from "react";
import './Converter.css'

export default function Converter({setList, id, openList, handleConverter, calcValute, value}) {
  const divRef = useRef(null);
  const [data, setData] = useState({});
  const [hiddenList, setHiddenList] = useState(true);
  const [inputValue, setInputValue] = useState(value);
  const [activeValute, setActiveValute] = useState("RUB");

  useEffect(() => {
    const fetchValues = async() => {
      try {
        let valutes = await getValutes();
        setData(valutes);
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchValues();
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!hiddenList  && !divRef.current.contains(e.target) && !e.target.className.includes('arrow')) {
        setList(id);
        setHiddenList(prev => !prev);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hiddenList, id, setList]);

  useEffect(() => {

    const timer = setTimeout(() => {
      calcValute(id, inputValue);
    }, 500)

    return () => clearTimeout(timer)

  }, [inputValue])

  const handleActiveValute = (valute) => {
    setActiveValute(valute);
    handleConverter(valute, id);
  }

  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <div className="converter">
      <div className="header-btns">
        {['RUB', 'USD', 'EUR', 'GBP'].map((item) => (
          <button key={item} onClick={() => handleActiveValute(item)} className={activeValute === item ? 'activeValute' : ''}>{item}</button>
        ))}
        <button onClick={() => {setList(id); setHiddenList(prev => !prev);}} className={'arrow'}>
          <img src="../public/arrow.png" alt="arrow" className={'arrow'}/>
        </button>

        <ul className={openList !== id ? 'available-valutes hidden' : 'available-valutes'} ref={divRef}>
          {Object.keys(data).map((valute) => (
            <li key={data[valute].Name} className='available-valutes__item'>{data[valute].Name} <span>{data[valute].CharCode}</span></li>
          ))}
        </ul>
      </div>

      <div className="input-box">
        <input type="text" className={'input-valute'} onChange={(e) => setInputValue(e.target.value)} value={inputValue} />
      </div>
    </div>
  )
}