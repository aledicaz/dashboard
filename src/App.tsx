import './App.css';
import Grid from '@mui/material/Grid2';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather'; // Asegúrate de importar TableWeather
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from './interface/Item'; // Asegúrate de importar la interfaz Item
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  let [indicators, setIndicators] = useState<Indicator[]>([]);
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"));
  let [items, setItems] = useState<Item[]>([]); // Estado para los items

  useEffect(() => {

    let request = async () => {

      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      let nowTime = (new Date()).getTime();

      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        let API_KEY = "b8d5f84990c4d0bb46a735a3c7f5038b";
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
        savedTextXML = await response.text();

        let hours = 0.01;
        let delay = hours * 3600000;
        let expiringTime = nowTime + delay;

        localStorage.setItem("openWeatherMap", savedTextXML);
        localStorage.setItem("expiringTime", expiringTime.toString());
        localStorage.setItem("nowTime", nowTime.toString());
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString());
        localStorage.setItem("nowDateTime", new Date(nowTime).toString());

        setOWM(savedTextXML);
      }

      if (savedTextXML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        let dataToIndicators: Indicator[] = [];

        let name = xml.getElementsByTagName("name")[0].innerHTML || "";
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name });

        let location = xml.getElementsByTagName("location")[1];
        let latitude = location.getAttribute("latitude") || "";
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude });

        let longitude = location.getAttribute("longitude") || "";
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude });

        let altitude = location.getAttribute("altitude") || "";
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude });

        setIndicators(dataToIndicators);

        let dataToItems: Item[] = [];
        const times = xml.getElementsByTagName("time");

        for (let i = 0; i < Math.min(times.length, 6); i++) {
          let time = times[i];

          let dateStart = time.getAttribute("from") || "";
          let dateEnd = time.getAttribute("to") || "";
          let precipitation = time.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || "";
          let humidity = time.getElementsByTagName("humidity")[0]?.getAttribute("value") || "";
          let clouds = time.getElementsByTagName("clouds")[0]?.getAttribute("all") || "";

          dataToItems.push({
            dateStart,
            dateEnd,
            precipitation,
            humidity,
            clouds
          });
        }

        setItems(dataToItems);
      }
    };

    request();

  }, [owm]);  {/* Dependencia: owm */ }

  let renderIndicators = () => {
    return indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather
          title={indicator["title"]}
          subtitle={indicator["subtitle"]}
          value={indicator["value"]} />
      </Grid>
    ));
  };

  return (
    <Grid container spacing={5}>

      {/* Indicadores */}
      {renderIndicators()}

      {/* Tabla - PASANDO 'items' COMO PROPS AL COMPONENTE TableWeather */}
      <Grid size={{ xs: 12, xl: 8 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, xl: 3 }}>
            <ControlWeather />
          </Grid>
          <Grid size={{ xs: 12, xl: 9 }}>
            <TableWeather itemsIn={items} /> {/* PASA items COMO PROPS */}
          </Grid>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, xl: 4 }}>
        <LineChartWeather />
      </Grid>

    </Grid>
  );
}

export default App;
