import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer
} from '@mui/material';
import { ReporteVenta } from '../types/Reporte';

interface Props {
  data: ReporteVenta[];
}

const ReporteChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ventas Registradas
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell align="center">Sucursal</TableCell>
              <TableCell align="right">Total Venta</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {new Date(row.fecha).toLocaleString()}
                </TableCell>

                <TableCell align="center">
                  {row.sucursalId}
                </TableCell>

                <TableCell align="right">
                  ${row.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReporteChart;
