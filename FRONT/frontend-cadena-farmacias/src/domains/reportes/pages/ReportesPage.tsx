import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { ReporteService } from '../clients/ReporteService';
import { ReporteVenta } from '../types/Reporte';
import ReporteChart from '../components/ReporteChart';

const ReportesPage: React.FC = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [data, setData] = useState<ReporteVenta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    // Validaciones
    if (!desde || !hasta) {
      setError('Seleccione ambas fechas.');
      setData([]);
      return;
    }

    if (desde > hasta) {
      setError('La fecha "Desde" no puede ser mayor que "Hasta".');
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ReporteService.getVentasPorPeriodo(desde, hasta);

      const ventas: ReporteVenta[] = Array.isArray(response.data)
        ? response.data
        : [];

      setData(ventas);

      if (ventas.length === 0) {
        setError('No existen ventas en el período seleccionado.');
      }
    } catch (e) {
      setError('Error al obtener el reporte de ventas.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Cálculo seguro (usa `total`, que SÍ viene del backend)
  const totalPeriodo = data.reduce(
    (acc, curr) => acc + (typeof curr.total === 'number' ? curr.total : 0),
    0
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Reporte de Ingresos
      </Typography>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Desde"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />

          <TextField
            label="Hasta"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{ height: 56, px: 4 }}
          >
            Generar
          </Button>
        </Stack>
      </Paper>

      {/* Estados */}
      {loading && (
        <Box textAlign="center" py={5}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && data.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                bgcolor: 'primary.main',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Typography variant="overline">
                Total Ingresos en Periodo
              </Typography>
              <Typography variant="h3">
                ${totalPeriodo.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <ReporteChart data={data} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ReportesPage;
