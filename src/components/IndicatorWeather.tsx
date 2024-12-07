interface Indicator {
    title?: String;
    subtitle?: String;
    value?: String;
}

export default function IndicatorWeather(config: Indicator) {
    return (
        <>
            {config.title}<br />
            {config.value}<br />
            {config.subtitle}
        </>
    )
}