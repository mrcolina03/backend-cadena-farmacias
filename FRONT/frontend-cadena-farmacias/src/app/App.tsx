import React, { useEffect, useState } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet
} from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';

// Material UI
import { Box, Typography } from '@mui/material';

// OAuth
import { userManager } from '../auth/oidc';

// --- Vistas del dominio Catálogo ---
import MedicineListPage from '../domains/catalog/pages/MedicineListPage';
import ClientListPage from '../domains/catalog/pages/ClientListPage';
import PrescriptionListPage from '../domains/catalog/pages/PrescriptionListPage';

// --- Vistas del dominio Inventario ---
import SucursalListPage from '../domains/Inventario/pages/SucursalListPage';
import StockPage from '../domains/Inventario/pages/InventarioSucursales';
import SucursalListPageInactivas from '../domains/Inventario/pages/SucursalListPageInactivas';

// --- 🛒 Ventas ---
import VentaListPage from '../domains/ventas/pages/VentaListPage';

// --- 📈 Reportes ---
import ReportesPage from '../domains/reportes/pages/ReportesPage';

// --- OAuth Callback ---
import Callback from '../pages/Callback';

/* ======================================================
   🔐 Componente que protege rutas (RequireAuth)
   ====================================================== */
const RequireAuth: React.FC = () => {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        userManager.getUser().then(user => {
            if (!user || user.expired) {
                userManager.signinRedirect(); // redirige al oauth-server
            } else {
                setAuthenticated(true);
            }
            setChecking(false);
        });
    }, []);

    if (checking) {
        return <Typography sx={{ p: 3 }}>Verificando sesión...</Typography>;
    }

    return authenticated ? <Outlet /> : null;
};

/* ======================================================
   🚀 App
   ====================================================== */
const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* 🔁 Ruta raíz */}
                <Route path="/" element={<Navigate to="/catalog/medicamentos" replace />} />

                {/* 🔑 OAuth callback */}
                <Route path="/callback" element={<Callback />} />

                {/* 🔐 Rutas protegidas */}
                <Route element={<RequireAuth />}>
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

                        {/* 404 */}
                        <Route
                            path="*"
                            element={
                                <Box sx={{ p: 5, textAlign: 'center' }}>
                                    <Typography variant="h4">404: Página no encontrada</Typography>
                                </Box>
                            }
                        />

                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
