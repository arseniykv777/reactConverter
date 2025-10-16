import {getValutes} from "./api.js";
import {useEffect, useRef, useState} from "react";
import './Converter.css'

export default function Converter({setList, id, openList, handleConverter, calcValute, value, valute, valuteCourse}) {
  const divRef = useRef(null);
  const [data, setData] = useState({});
  const [hiddenList, setHiddenList] = useState(true);
  const [inputValue, setInputValue] = useState(value);
  const [activeValute, setActiveValute] = useState(valute);
  const [gbpValute, setGbpValute] = useState('GBP'); // выборочная валюта
  const valutesBtns = ['RUB', 'USD', 'EUR', gbpValute];

  useEffect(() => {
    if (!valutesBtns.includes(valute)) {
      setGbpValute(valute);
    }
    setActiveValute(valute);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valute])

  // получение списка валют 
  useEffect(() => {
    const fetchValues = async() => {
      try {
        let valutes = await getValutes();
        setData(valutes);
      } catch (error) {
        console.log(error.message);
      }
    }
    // noinspection JSIgnoredPromiseFromCall
    fetchValues();
  }, [])

  // скрытие списка валют 
  useEffect(() => {
    if (!hiddenList) {
      const handleClickOutside = (e) => {
        if (!hiddenList && !divRef.current.contains(e.target) && !e.target.className.includes('arrow')) {
          setList(id);
          setHiddenList(prev => !prev);
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiddenList]);
  


  useEffect(() => {
    calcValute(id, inputValue );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleActiveValute = (valute) => {
    setActiveValute(valute);
    handleConverter(valute, id);
  }
  
  
  // вывод вычисления 
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
    <div className={id === 2 ? 'converter secondConverter' : 'converter'}>
      <div className="header-btns">
        {valutesBtns.map((item) => (
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
        <p className={'valuteCourse'}>{valuteCourse}</p>
      </div>
    </div>
  )
}