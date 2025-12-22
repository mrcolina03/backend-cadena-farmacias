import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout'; // Ajusta la ruta según tu estructura

// Importación de componentes de Material UI (Corrige errores 2304)
import { Box, Typography } from '@mui/material';

// --- Vistas del dominio Catálogo ---
import MedicineListPage from '../domains/catalog/pages/MedicineListPage';
import ClientListPage from '../domains/catalog/pages/ClientListPage';
import PrescriptionListPage from '../domains/catalog/pages/PrescriptionListPage';

// --- Vistas del dominio Inventario ---
import SucursalListPage from '../domains/Inventario/pages/SucursalListPage';
import StockPage from '../domains/Inventario/pages/InventarioSucursales';
import SucursalListPageInactivas from '../domains/Inventario/pages/SucursalListPageInactivas';

// --- 🛒 Vistas del Dominio: Ventas ---
import VentaListPage from '../domains/ventas/pages/VentaListPage';

// --- 📈 Vistas del Dominio: Reportes ---
// Si el error 2307 persiste, verifica que el archivo exista en esa ruta exacta
import ReportesPage from '../domains/reportes/pages/ReportesPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog/medicamentos" replace />} />
        
        <Route element={<MainLayout />}>
          
          {/* Dominio Catálogo */}
          <Route path="/catalog">
            <Route path="medicamentos" element={<MedicineListPage />} />
            <Route path="clientes" element={<ClientListPage />} />
            <Route path="prescripciones" element={<PrescriptionListPage />} />
          </Route>

          {/* Dominio Ventas */}
          <Route path="/ventas">
            <Route index element={<VentaListPage />} />
          </Route>
          
          {/* Dominio Reportes */}
          <Route path="/reportes">
            <Route index element={<ReportesPage />} />
          </Route>
          
          {/* Dominio Inventario */}
          <Route path="/inventario">
            <Route path="sucursal" element={<SucursalListPage />} />
            <Route path="sucursal/:sucursalId" element={<StockPage />} />
            <Route path="sucursal/inactivas" element={<SucursalListPageInactivas />} />
          </Route>

          {/* Manejo de error 404 corregido con importaciones de MUI */}
          <Route path="*" element={
            <Box sx={{ p: 5, textAlign: 'center' }}>
              <Typography variant="h4">404: Página no encontrada</Typography>
            </Box>
          } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;