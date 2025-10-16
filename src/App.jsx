import './App.css'

import Converter from "./Converter.jsx";
import {useEffect, useState} from "react";
import {calcCourse, getValuteCourse} from "./api.js";

export function App() {
  // 0 - никакой список не открыт
  // 1 - открыт первый список
  // 2 - открыт второй список
  const [openList, setOpenList] = useState(0);
  const [valutesConverters, setValutesConverters] = useState({
    1: 'RUB',
    2: 'USD',
    lastClickConvrt: 0
  });

  const [valueFirst, setValueFirst] = useState(0);
  const [valueSecond, setValueSecond] = useState(0);
  const [block, setBlock] = useState(false) // чтобы пересчет не вызывался второй раз
  const [outputValue, setOutputValue] = useState({});
  const [sendValue, setSendValue] = useState({});
  const [valutesCourse, setValutesCourse] = useState({
    1: '',
    2: ''
  });

  const handleConverter = (valute, id) => {
    // noinspection JSCheckFunctionSignatures
    setValutesConverters(prev => ({
      ...prev,
      [id]: valute,
      lastClickConvrt: id
    }))
  }


  useEffect(() => {
    const valutesCourse = async() => {
      if (valutesConverters[1] === valutesConverters[2]) {
        return 'RUB';
      }
      return await getValuteCourse(valutesConverters[1], valutesConverters[2])
    }

    valutesCourse().then((result) => {
      if (result === 'RUB') {
        setValutesCourse({
          1: `1 RUB = 1 RUB`,
          2: `1 RUB = 1 RUB`,
        })
      } else {
        setValutesCourse({
          1: `1 ${valutesConverters[1]} = ${result[0]} ${valutesConverters[2]}`,
          2: `1 ${valutesConverters[2]} = ${result[1]} ${valutesConverters[1]}`,
        })
      }
    });
    if (!sendValue || !outputValue) return

    let value;
    let id = valutesConverters.lastClickConvrt;

    if (id === 2) id = 1;
    sendValue.id === id ? value = sendValue.value : value = outputValue.value;
    // noinspection JSIgnoredPromiseFromCall
    calcValute(id, value, valutesConverters[id])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valutesConverters])

  const calcValute = async (id, value, valute = undefined, valutes = valutesConverters) => {
    if (value !== 0 && value !== undefined && Number(value)) {
      if (block) {
        setBlock(false)
      } else {
        const secondValute = id === 1 ? valutes[2] : valutes[1]

        if ((valutes[id] === secondValute)) {
          id === 1 ? setValueSecond(value) : setValueFirst(value)
          setOutputValue({value: value, id: id === 1 ? 2 : 1})
          setSendValue({value: value, id: id})
        } else {
          const calc = await calcCourse(valute ?? valutes[id], value, secondValute)
          id === 1 ? setValueSecond(calc) : setValueFirst(calc)
          setOutputValue({value: calc, id: id === 1 ? 2 : 1})
          setSendValue({value: value, id: id})
        }

        setBlock(true)
      }
    } else {
      id === 1 ? setValueSecond(0) : setValueFirst(0)
      setOutputValue({value: 0, id: id === 1 ? 2 : 1})
      setSendValue({value: 0, id: id})
    }
  }

  const setList = (id) => {
    if (openList === id) {
      setOpenList(0);
    } else {
      setOpenList(id);
    }
  }

  const changeValutesBetween = () => {
    let key;
    valutesConverters.lastClickConvrt === 1 ? key = 2 : key = 1
    setValutesConverters({1: valutesConverters[2], 2: valutesConverters[1], lastClickConvrt: key})
  }


  return (
    <>
      <header className="App-header">
        <h1>Конвертер валют</h1>
      </header>
      <main className="App-main">
        <div>
          <p className={'pre-converter'}>У меня есть</p>
          <Converter setList={setList} id={1} openList={openList} handleConverter={handleConverter}
                     calcValute={calcValute} value={valueFirst} valute={valutesConverters[1]} valuteCourse={valutesCourse[1]}/>
        </div>
        <img src='../icons/exchange_arrow.png' alt='exchange arrow' className={'exchange-arrow'} onClick={changeValutesBetween}/>
        <div>
          <p className={'pre-converter'}>Хочу приобрести</p>
          <Converter setList={setList} id={2} openList={openList} handleConverter={handleConverter}
                     calcValute={calcValute} value={valueSecond} valute={valutesConverters[2]} valuteCourse={valutesCourse[2]}/>
        </div>
      </main>
    </>
  )
}