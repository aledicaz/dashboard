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

  }, [owm]); {/* Dependencia: owm */ }

  let renderIndicators = () => {
    return indicators.map((indicator, idx) => (
      
      <Grid
        key={idx}
        xs={12}
        sm={6}
        md={3}
        lg={3}
        sx={{ flexGrow: 1 }}
      >
        <IndicatorWeather
          title={indicator.title}
          subtitle={indicator.subtitle}
          value={indicator.value}
        />
      </Grid>
      
    ));
  };

  return (
    <Grid container sx={{ width: '100%' }} spacing={5}>

      <Grid sm={8} md={9} lg={9} xl={9} sx={{ textAlign: 'left', marginY: 3, padding: 3, color: 'white' }}>
        <h3 id='inicio-title'>Ecuador</h3>
        <p id='inicio-text'>
          Aquí encontrarás la información más actualizada sobre el clima de nuestra ciudad, incluyendo temperaturas, condiciones meteorológicas y pronósticos. ¡Mantente informado y planifica tu día con confianza!
        </p>
      </Grid>

      {/* Indicadores */}
      {renderIndicators()}

      {/* Tabla - PASANDO 'items' COMO PROPS AL COMPONENTE TableWeather */}
      {/*</Grid><Grid container size={{ xs: 12, md: 12, lg: 12 }} id="table" > */}
      <Grid container xs={12} md={12} lg={12} id="table">

        {/*<Grid size={{ xs: 12, md: 12, lg: 12 }} id="title">*/}
        <Grid xs={12} md={12} lg={12} id="title">
          <h2 className='section-title'>Historial Climático</h2>
          <p className='section-text'>
            Estos indicadores climáticos te ofrecen una visión clara y detallada de las condiciones meteorológicas en Guayaquil, permitiéndote estar siempre preparado y bien informado. Ya sea que necesites saber si llevar un paraguas, qué ropa vestir o simplemente tengas curiosidad por el clima, estos datos te serán de gran ayuda.
          </p>
        </Grid>

        <Grid container spacing={2}>
          {/*<Grid size={{ xs: 12, md: 12, lg: 12 }} sx={{ marginY: 2 }}>*/}
          <Grid xs={12} md={12} lg={12} sx={{ marginY: 2 }}>
            <TableWeather itemsIn={items} /> {/* PASA items COMO PROPS */}
          </Grid>
        </Grid>

      </Grid>


      {/* Gráfico */}
      {/* <Grid size={{ xs: 12, md: 12, lg: 12 }} id="graphic">*/}
      <Grid container xs={12} md={12} lg={12} id="graphic">

         {/*<Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }} id="title">*/}
        <Grid xs={12} sm={12} md={12} lg={12} id="title">
          <h2 className='section-title'>Gráfico Climático</h2>
          <p className='section-text'>
            Esta gráfica proporciona una visión integral de las principales variables climáticas que afectan el tiempo en Guayaquil. A través de esta visualización, podrás observar cómo varían la humedad, la precipitación y la nubosidad a lo largo del tiempo, lo que te ayudará a entender mejor las condiciones meteorológicas actuales y planificar tus actividades de manera más efectiva.
          </p>
        </Grid>
        
        {/* <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3 }} id="control-panel" sx={{ marginY: 2 }}>*/}
        <Grid xs={12} sm={12} md={3} lg={3} id="control-panel" sx={{ marginY: 2 }}>
          <ControlWeather />
        </Grid>

        {/* <Grid size={{ xs: 12, sm: 12, md: 9, lg: 9 }} sx={{ zIndex: 1, marginY: 2 }}>*/}
        <Grid xs={12} sm={12} md={9} lg={9} sx={{ zIndex: 1, marginY: 2 }}>
          <LineChartWeather />
        </Grid>

      </Grid>

    </Grid>
  );
}

export default App;
