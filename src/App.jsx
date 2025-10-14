import './App.css'

import Converter from "./Converter.jsx";
import {useState} from "react";
import {calcCourse} from "./api.js";

export default function App() {
  // 0 - никакой список не открыт
  // 1 - открыт первый список
  // 2 - открыт второй список
  const [openList, setOpenList] = useState(0);
  const [valutesConverters, setValutesConverters] = useState({
    1: 'RUB',
    2: 'RUB',
  });

  const [valueFirst, setValueFirst] = useState(0);
  const [valueSecond, setValueSecond] = useState(0);

  const handleConverter = (valute, id) => {
    setValutesConverters(prev => ({...prev, [id]: valute}));
  }

  const calcValute = async (id, value) => {
    let secondValute;
    id === 1 ? secondValute = valutesConverters[2] : secondValute = valutesConverters[1]

    const calc = await calcCourse(valutesConverters[id], value, secondValute);
    id === 1 ? setValueSecond(calc) : setValueFirst(calc);
  }

  const setList = (id) => {
    if (openList === id) {
      setOpenList(0);
    } else {
      setOpenList(id);
    }
  }

  return (
    <>
      <header className="App-header">
        <h1>Конвертер валют</h1>
      </header>
      <main className="App-main">
        <Converter setList={setList} id={1} openList={openList} handleConverter={handleConverter} calcValute={calcValute} value={valueFirst}/>
        <img src='../public/exchange_arrow.png' alt='exchange arrow' className={'exchange-arrow'}/>
        <Converter setList={setList} id={2} openList={openList} handleConverter={handleConverter} calcValute={calcValute} value={valueSecond}/>
      </main>
    </>
  )
}