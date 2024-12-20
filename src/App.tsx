import './App.css';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import { Item } from './interface/Item';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  let [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selected, setSelected] = useState(-1);
  let [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const request = async () => {
      const API_KEY = 'b8d5f84990c4d0bb46a735a3c7f5038b';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`
      );
      const savedTextXML = await response.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, 'application/xml');

      const dataToIndicators: Indicator[] = [];
      const name = xml.getElementsByTagName('name')[0]?.textContent || '';
      dataToIndicators.push({ title: 'Location', subtitle: 'City', value: name });

      const location = xml.getElementsByTagName('location')[1];
      const latitude = location.getAttribute('latitude') || '';
      const longitude = location.getAttribute('longitude') || '';
      const altitude = location.getAttribute('altitude') || '';
      dataToIndicators.push({ title: 'Location', subtitle: 'Latitude', value: latitude });
      dataToIndicators.push({ title: 'Location', subtitle: 'Longitude', value: longitude });
      dataToIndicators.push({ title: 'Location', subtitle: 'Altitude', value: altitude });

      setIndicators(dataToIndicators);

      const dataToItems: Item[] = [];
      const time = Array.from(xml.getElementsByTagName('time')).slice(0, 6);

      time.forEach((timeNode) => {
        const from = timeNode.getAttribute('from') || '';
        const to = timeNode.getAttribute('to') || '';
        const precipitation = timeNode.getElementsByTagName('precipitation')[0]?.getAttribute('probability') || '';
        const humidity = timeNode.getElementsByTagName('humidity')[0]?.getAttribute('value') || '';
        const clouds = timeNode.getElementsByTagName('clouds')[0]?.getAttribute('all') || '';
        dataToItems.push({ dateStart: from, dateEnd: to, precipitation, humidity, clouds });
      });

      setItems(dataToItems);
    };

    request();
  }, []);

  const navigateTo = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
  <ListItem>
    <Typography variant="h6">Dashboard Clima</Typography>
  </ListItem>
  <ListItemButton onClick={() => navigateTo('inicio-title')} sx={{ marginY: 1 , marginTop: 3}}>
    <ListItemText sx={{ marginLeft: 1}} primary="Indicadores" />
  </ListItemButton>
  <ListItemButton onClick={() => navigateTo('table')} sx={{ marginY: 1 }}>
    <ListItemText sx={{ marginLeft: 1}} primary="Historial" />
  </ListItemButton>
  <ListItemButton onClick={() => navigateTo('graphic')} sx={{ marginY: 1 }}>
    <ListItemText sx={{ marginLeft: 1}} primary="Gráfica" />
  </ListItemButton>
</List>
      </Drawer>

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Clima en Guayaquil
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, paddingTop: '64px', paddingX: 3 }}>
        <Grid container spacing={5}>
          
          <Grid size={{ xs: 12 }} id="inicio-title">
            <h3 id = "tituloGye">Guayaquil, Ecuador</h3>
            <h2 className="section-title">Indicadores</h2>
            <p id="inicio-text">
              Aquí podrás acceder a la información más reciente sobre el clima de nuestra ciudad, incluyendo detalles sobre temperaturas,
              condiciones del tiempo y pronósticos. ¡Mantente al tanto para organizar tu día con tranquilidad!
            </p>
          </Grid>

          {
                    indicators
                        .map(
                            (indicator, idx) => (
                                <Grid key={idx} size={{sm: 6}}>
                                    <IndicatorWeather
                                        title={indicator["title"]}
                                        subtitle={indicator["subtitle"]}
                                        value={indicator["value"]} />
                                </Grid>
                            )
                        )
                }
        </Grid>

        <Grid container spacing={5} id="table">
          <Grid size={{ xs: 12 }}>
            <h2 className="section-title">Historial Climático</h2>
            <p className="section-text">
              Estos indicadores del clima te brindan una visión precisa y completa de las condiciones meteorológicas en Guayaquil.
            </p>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TableWeather itemsIn={items} />
          </Grid>
        </Grid>

        <Grid container spacing={5} id="graphic">
          <Grid size={{ xs: 12 }}>
            <h2 className="section-title">Gráfico Climático</h2>
            <p className="section-text">
              Esta gráfica ofrece una perspectiva completa de las principales variables que influyen en el clima de Guayaquil.
            </p>
          </Grid>
          <Grid size={{ xs: 12, xl: 6 }}>   
            <LineChartWeather itemsIn={items} selected={selected} />
            <ControlWeather setSelected={setSelected} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;

