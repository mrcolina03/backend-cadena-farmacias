import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '@components/layout/Sidebar';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Esto será el componente de navegación lateral */}
      <Sidebar /> 
      
      {/* Contenido principal con espacio para navegación fija */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        {/* Aquí se renderizará el componente de la ruta anidada */}
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default MainLayout;