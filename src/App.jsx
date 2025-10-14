import './App.css'

import Converter from "./Converter.jsx";
import {useState} from "react";

export default function App() {
  // 0 - никакой список не открыт
  // 1 - открыт первый список
  // 2 - открыт второй список
  const [openList, setOpenList] = useState(0);

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
        <Converter setList={setList} id={1} openList={openList}/>
        <img src='../public/exchange_arrow.png' alt='exchange arrow' className={'exchange-arrow'}/>
        <Converter setList={setList} id={2} openList={openList}/>
      </main>
    </>
  )
}