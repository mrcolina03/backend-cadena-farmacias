import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

// Iconos
import MedicationIcon from '@mui/icons-material/Medication';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StoreIcon from '@mui/icons-material/Store';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';

import { userManager } from "../../auth/oidc";

const drawerWidth = 280;

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const sidebarItems: NavItem[] = [
  // --- Ventas ---
  { text: 'Gestión de Ventas', icon: <ShoppingCartCheckoutIcon />, path: '/ventas' },
  { text: 'Reporte de Ingresos', icon: <BarChartIcon />, path: '/reportes' },

  // --- Catálogo ---
  { text: 'Medicamentos', icon: <MedicationIcon />, path: '/catalog/medicamentos' },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/catalog/clientes' },
  { text: 'Prescripciones', icon: <ReceiptLongIcon />, path: '/catalog/prescripciones' },

  // --- Inventario ---
  { text: 'Sucursales Activas', icon: <StoreIcon />, path: '/inventario/sucursal' },
  { text: 'Sucursales Inactivas', icon: <StoreOutlinedIcon />, path: '/inventario/sucursal/inactivas' },

  // --- Seguridad ---
  { text: 'Usuarios', icon: <SecurityIcon />, path: '/seguridad/usuarios' },
];

const Sidebar: React.FC = () => {

  const handleLogout = async () => {
    try {
      await userManager.signoutRedirect();
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const ventasReportes = sidebarItems.slice(0, 2);
  const catalogo = sidebarItems.slice(2, 5);
  const inventario = sidebarItems.slice(5, 7);
  const seguridad = sidebarItems.slice(7, 8);

  const renderNavSection = (title: string, items: NavItem[]) => (
    <List sx={{ px: 1 }}>
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography
          variant="overline"
          sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}
        >
          {title}
        </Typography>
      </Box>

      {items.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={NavLink}
            to={item.path}
            end
            sx={{
              borderRadius: 2,
              '&.active': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                '& .MuiTypography-root': { fontWeight: 'bold' },
              },
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
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
          borderRight: 'none',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">
          FarmaApp System
        </Typography>
      </Toolbar>

      <Box sx={{ overflow: 'auto', py: 1 }}>
        {renderNavSection('Ventas y Análisis', ventasReportes)}
        <Divider sx={{ mx: 2, my: 1 }} />

        {renderNavSection('Módulos de Catálogo', catalogo)}
        <Divider sx={{ mx: 2, my: 1 }} />

        {renderNavSection('Inventario', inventario)}
        <Divider sx={{ mx: 2, my: 1 }} />

        {renderNavSection('Seguridad', seguridad)}
      </Box>

      <Divider sx={{ mx: 2, my: 1 }} />

      <Box sx={{ p: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: 'error.main',
                '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' },
              }}
            >
              <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Cerrar sesión"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
