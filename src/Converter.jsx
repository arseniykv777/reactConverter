import {getValutes} from "./api.js";
import {useEffect, useRef, useState} from "react";
import './Converter.css'

export default function Converter({setList, id, openList, handleConverter, calcValute, value}) {
  const divRef = useRef(null);
  const [data, setData] = useState({});
  const [hiddenList, setHiddenList] = useState(true);
  const [inputValue, setInputValue] = useState(value);
  const [activeValute, setActiveValute] = useState(id === 1 ? 'RUB' : 'USD');
  const [gbpValute, setGbpValute] = useState('GBP');

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
      if (!hiddenList && !divRef.current.contains(e.target) && !e.target.className.includes('arrow')) {
        setList(id);
        setHiddenList(prev => !prev);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hiddenList]);

  useEffect(() => {
    calcValute(id, inputValue );
  }, [inputValue]);

  const handleActiveValute = (valute) => {
    setActiveValute(valute);
    handleConverter(valute, id);
  }

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleChangeGBP = (charcode) => {
    const gbp = document.querySelector(`.valute-gbp${id}`);
    gbp.textContent = charcode;
    setGbpValute(charcode);
    setList(id);
    setHiddenList(prev => !prev);
    handleActiveValute(charcode);
  }

  return (
    <div className="converter">
      <div className="header-btns">
        {['RUB', 'USD', 'EUR', gbpValute].map((item) => (
          <button key={item} onClick={() => handleActiveValute(item)} className={`${
            item === gbpValute ? `valute-gbp${id}` : ''
          } ${activeValute === item ? 'activeValute' : ''}`}>{item}</button>
        ))}
        <button onClick={() => {setList(id); setHiddenList(prev => !prev);}} className={'arrow'}>
          <img src="../public/arrow.png" alt="arrow" className={'arrow'}/>
        </button>

        <ul className={openList !== id ? 'available-valutes hidden' : 'available-valutes'} ref={divRef}>
          {Object.keys(data).map((valute) => (
            <li key={data[valute].Name} className='available-valutes__item' onClick={() => handleChangeGBP(data[valute].CharCode)}>{data[valute].Name} <span>{data[valute].CharCode}</span></li>
          ))}
        </ul>
      </div>

      <div className="input-box">
        <input type="text" className={'input-valute'} onChange={(e) => setInputValue(e.target.value)} value={inputValue} />
      </div>
    </div>
  )
}