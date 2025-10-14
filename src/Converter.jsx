import {getValutes} from "./api.js";
import {useEffect, useRef, useState} from "react";
import './Converter.css'

export default function Converter({setList, id, openList}) {
  const divRef = useRef(null);
  const [data, setData] = useState({});
  const [hiddenList, setHiddenList] = useState(true);

  const toogleList = () => {
    setList(id);
    setHiddenList(prev => !prev);
  }

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
      if (!hiddenList  && !divRef.current.contains(e.target)) {
        toogleList();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hiddenList, toogleList]);

  return (
    <div className="converter">
      <div className="header-btns">
        <button>
          RUB
        </button>
        <button>
          USD
        </button>
        <button>
          EUR
        </button>
        <button onClick={toogleList}>
          <img src="../public/arrow.png" alt="arrow" className={'arrow'}/>
        </button>

        <ul className={openList !== id ? 'available-valutes hidden' : 'available-valutes'} ref={divRef}>
          {Object.keys(data).map((valute) => (
            <li key={data[valute].Name} className='available-valutes__item'>{data[valute].Name} <span>{data[valute].CharCode}</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}