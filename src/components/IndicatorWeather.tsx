import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface Indicator {
    title?: String;
    subtitle?: String;
    value?: String;
}

export default function IndicatorWeather(config: Indicator) {
   return (
    <Paper
      sx={{
        px: 2,
        py: 5,
        m: 2,
        display: "flex",
        flexDirection: "column",
        backgroundColor: 'white',
        borderRadius: '10px'
      }}
      elevation={5}
    >
      <Typography component="h2" variant="h6" sx={{ color: '#123f77' }} gutterBottom>
        {config.title}
      </Typography>
      <Typography component="p" variant="h4">
        {config.value}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {config.subtitle}
      </Typography>
    </Paper>
  );
}