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
    2: 'USD',
  });

  const [valueFirst, setValueFirst] = useState(0);
  const [valueSecond, setValueSecond] = useState(0);
  const [block, setBlock] = useState(false) // чтобы пересчет не вызывался второй раз
  const [outputValue, setOutputValue] = useState({});
  const [sendValue, setSendValue] = useState({});

  const handleConverter = (valute, id) => {
    setValutesConverters(prev => ({...prev, [id]: valute}));
    setTimeout(() => {
      if (id === sendValue.id) {
        calcValute(id, sendValue.value, valute);
      } else if (id === outputValue.id) {
       calcValute(id, outputValue.value, valute);
      }
    }, 500);

  }

  const calcValute = async (id, value, valute=undefined) => {
    if (value !== 0) {
      if (block) {
        setBlock(false)
      } else {
        let secondValute;
        id === 1 ? secondValute = valutesConverters[2] : secondValute = valutesConverters[1]

        const calc = await calcCourse(valute ? valute: valutesConverters[id], value, secondValute);
        id === 1 ? setValueSecond(calc) : setValueFirst(calc);
        setOutputValue({value: calc, id: id === 1 ? 2 : 1});
        setSendValue({value: value, id: id});
        setBlock(true);
      }
    }
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