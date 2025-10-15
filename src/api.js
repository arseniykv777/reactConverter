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
      const value1 = data['Valute'][mainValute].Value * value;
      const value2 = data['Valute'][secondValute].Value;
      let result = value1 / value2;
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