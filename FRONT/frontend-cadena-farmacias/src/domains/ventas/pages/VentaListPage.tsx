import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import VentaList from '../components/VentaList';
// import VentaForm from '../components/VentaForm'; // Lo importarás cuando lo crees

const VentaListPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <VentaList />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default VentaListPage;