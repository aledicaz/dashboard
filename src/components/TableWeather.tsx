import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Item } from '../interface/Item';

// Interfaz del prop
interface MyProp {
  itemsIn: Item[];  // itemsIn es un arreglo de tipo Item
}

// Componente principal
export default function BasicTable(props: MyProp) {
  const [rows, setRows] = useState<Item[]>([]);

  useEffect(() => {
    setRows(props.itemsIn);
  }, [props]);

  const formatTime = (dateStr: string) => {
    const parsedDate = new Date(dateStr);

    if (isNaN(parsedDate.getTime()) || dateStr.trim() === '') {
      return '00:00:00';
    }

    // Formatear la hora, minutos y segundos en el formato HH:mm:ss
    const hours = parsedDate.getHours().toString().padStart(2, '0');
    const minutes = parsedDate.getMinutes().toString().padStart(2, '0');
    const seconds = parsedDate.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;  // Retorna la hora en formato HH:mm:ss
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* Cabeceras de la tabla */}
            <TableCell>Hora de inicio</TableCell>
            <TableCell align="right">Hora de fin</TableCell>
            <TableCell align="right">Precipitación</TableCell>
            <TableCell align="right">Humedad</TableCell>
            <TableCell align="right">Nubosidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Iterar sobre el estado rows (que ahora contiene los itemsIn) */}
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {formatTime(row.dateStart.toString())}  {/* Mostrar la hora en formato HH:mm:ss */}
              </TableCell>

              <TableCell align="right">
                {formatTime(row.dateEnd.toString())}
              </TableCell> {/* Mostrar la hora en formato HH:mm:ss */}

              <TableCell align="right">
                {row.precipitation}
              </TableCell>

              <TableCell align="right">
                {row.humidity} %
              </TableCell>

              <TableCell align="right">
                {row.clouds}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}




