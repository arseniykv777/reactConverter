export async function getValutes() {
  let valutes = {};
  try {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();
    if (data) {
      for (const valute in data['Valute']) {
        if (data['Valute'][valute].CharCode === 'XDR') {
          continue;
        }
        valutes[valute] = {
          Name: data['Valute'][valute].Name,
          Value: data['Valute'][valute].Value,
          CharCode: data['Valute'][valute].CharCode,
        }
      }
      return valutes;
    }
    return null
  } catch (error) {
    console.error(error.message);
  }
}

const checkOnlyZeros = (str) => {
  const index = str.indexOf('.');
  const dots = index !== -1 ? str.slice(index) : str;
  return /^.0+$/.test(dots);
}

export async function calcCourse(mainValute, value, secondValute){
  try {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();

    if (data) {
      let result;
      if (mainValute === 'RUB') {
        const value2 = data['Valute'][secondValute].Value;
        result = value / value2;
      } else if (secondValute === 'RUB') {
        const value2 = data['Valute'][mainValute].Value;
        result = value2 * value;
      }
      else {
        const value1 = data['Valute'][mainValute].Value * value;
        const value2 = data['Valute'][secondValute].Value;
        result = value1 / value2;
      }

      result = result.toFixed(4);
      if (checkOnlyZeros(result)) {
        return Math.trunc(Number(result))
      }
      return result;
    }
  } catch (err) {
    console.error(err.message);
  }
}

export async function getValuteCourse(mainValute, secondValute) {
  try {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();

    if (data) {

      if (mainValute === 'RUB' || secondValute === 'RUB') {
        let oppositeValute;
        mainValute === 'RUB' ? oppositeValute = secondValute : oppositeValute = mainValute;
        let value = data['Valute'][oppositeValute].Value;
        let course = 1 / value;
        course = course.toFixed(4);
        if (checkOnlyZeros(course)) {
          course = Number(course)
        }

        value = value.toFixed(4);
        if (checkOnlyZeros(value)) {
          value = Number(value)
        }

        if (oppositeValute === mainValute) {
          return [value, course]
        }
        return [course, value]
      } else {
        let value1 = data['Valute'][mainValute].Value;
        let value2 = data['Valute'][secondValute].Value;
        let firstCourse = value1 / value2;
        firstCourse = firstCourse.toFixed(4);
        if (checkOnlyZeros(firstCourse)) {
          firstCourse = Number(firstCourse)
        }

        value1 = data['Valute'][secondValute].Value;
        value2 = data['Valute'][mainValute].Value;
        let secondCourse = value1 / value2;
        secondCourse = secondCourse.toFixed(4);
        if (checkOnlyZeros(secondCourse)) {
          secondCourse = Number(secondCourse);
        }

        return [firstCourse, secondCourse];
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}