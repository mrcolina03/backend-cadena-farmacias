import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

// Iconos existentes
import MedicationIcon from '@mui/icons-material/Medication';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StoreIcon from '@mui/icons-material/Store';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';

// Iconos para Ventas y Reportes
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import BarChartIcon from '@mui/icons-material/BarChart';

const drawerWidth = 280; // Ajustado ligeramente para mejor estética

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const sidebarItems: NavItem[] = [
  // --- Dominio Ventas (Rutas actualizadas a la nueva App.tsx) ---
  { text: 'Gestión de Ventas', icon: <ShoppingCartCheckoutIcon />, path: '/ventas' },
  { text: 'Reporte de Ingresos', icon: <BarChartIcon />, path: '/reportes' },
  
  // --- Dominio Catálogo ---
  { text: 'Medicamentos', icon: <MedicationIcon />, path: '/catalog/medicamentos' },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/catalog/clientes' },
  { text: 'Prescripciones', icon: <ReceiptLongIcon />, path: '/catalog/prescripciones' },

  // --- Dominio Inventario ---
  { text: 'Sucursales Activas', icon: <StoreIcon />, path: '/inventario/sucursal' },
  { text: 'Sucursales Inactivas', icon: <StoreOutlinedIcon />, path: '/inventario/sucursal/inactivas' },
];

const Sidebar: React.FC = () => {

  const ventasReportes = sidebarItems.slice(0, 2);
  const catalogo = sidebarItems.slice(2, 5);
  const inventario = sidebarItems.slice(5, 7);

  const renderNavSection = (title: string, items: NavItem[]) => (
    <List sx={{ px: 1 }}>
      <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}>
              {title}
          </Typography>
      </Box>
      {items.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={NavLink}
            to={item.path}
            end // Importante para que /ventas no marque activo a /ventas/detalle
            sx={{ 
              borderRadius: 2,
              '&.active': { 
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
                '& .MuiTypography-root': {
                  fontWeight: 'bold',
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
          borderRight: 'none'
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          FarmaApp System
        </Typography>
      </Toolbar>
      
      <Box sx={{ overflow: 'auto', py: 1 }}>
        {renderNavSection('Ventas y Análisis', ventasReportes)}
        <Divider sx={{ mx: 2, my: 1 }} />
        {renderNavSection('Módulos de Catálogo', catalogo)}
        <Divider sx={{ mx: 2, my: 1 }} />
        {renderNavSection('Inventario', inventario)}
      </Box>
    </Drawer>
  );
};

export default Sidebar;