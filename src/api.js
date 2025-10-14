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