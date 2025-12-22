import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TextField,
  Alert,
  Box,
  Typography
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import { InventarioSucursalDetallado } from '../../types/InventarioSucursal';
import { InventarioSucursalService } from '../../clients/InventarioSucursalServices';

interface Props {
  inventario: InventarioSucursalDetallado[];
  onRefresh: () => void;
}

const InventarioSucursalList: React.FC<Props> = ({ inventario, onRefresh }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [cantidadEdit, setCantidadEdit] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const startEdit = (item: InventarioSucursalDetallado) => {
    setError(null);
    setEditingId(item.idInventario);
    setCantidadEdit(item.cantidad);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCantidadEdit(0);
    setError(null);
  };

  const saveCantidad = async (item: InventarioSucursalDetallado) => {
    setError(null);

    // ✅ Validación pedida: cantidad >= stockMinimo
    if (!Number.isFinite(cantidadEdit) || cantidadEdit < item.stockMinimo) {
      setError(`La cantidad no puede ser menor que el stock mínimo (${item.stockMinimo}).`);
      return;
    }

    try {
      await InventarioSucursalService.updateCantidad(item.idInventario, cantidadEdit);
      cancelEdit();
      onRefresh();
    } catch (err: any) {
      console.error('Error al actualizar cantidad:', err);
      const msg =
        err.response?.data?.message ||
        'Error al actualizar el stock. Verifique la conexión o las validaciones del backend.';
      setError(msg);
    }
  };

  const desactivar = async (item: InventarioSucursalDetallado) => {
    if (!window.confirm(`¿Desactivar el inventario del medicamento "${item.nombre}"?`)) return;

    try {
      await InventarioSucursalService.deleteLogico(item.idInventario);
      onRefresh();
    } catch (err: any) {
      console.error('Error al desactivar inventario:', err);
      setError(err.response?.data?.message || 'Error al desactivar el inventario.');
    }
  };

  const activar = async (item: InventarioSucursalDetallado) => {
    if (!window.confirm(`¿Activar nuevamente el inventario del medicamento "${item.nombre}"?`)) return;

    try {
      await InventarioSucursalService.activarInventario(item.idInventario);
      onRefresh();
    } catch (err: any) {
      console.error('Error al activar inventario:', err);
      setError(err.response?.data?.message || 'Error al activar el inventario.');
    }
  };

  const eliminarFisico = async (item: InventarioSucursalDetallado) => {
    if (!window.confirm(`⚠️ Eliminar físicamente "${item.nombre}" del inventario. ¿Seguro?`)) return;

    try {
      await InventarioSucursalService.deleteFisico(item.idInventario);
      onRefresh();
    } catch (err: any) {
      console.error('Error al eliminar físicamente:', err);
      setError(err.response?.data?.message || 'Error al eliminar físicamente el inventario.');
    }
  };

  if (!inventario || inventario.length === 0) {
    return <Alert severity="info">Esta sucursal no tiene inventario registrado.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Medicamentos en Inventario
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table aria-label="inventario sucursal table">
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Medicamento</TableCell>
              <TableCell>Laboratorio</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="center">Stock Mín.</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Actualizado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {inventario.map((item) => {
              const isEditing = editingId === item.idInventario;
              const inactivo = item.estadoInventario === 'INACTIVO';

              return (
                <TableRow
                  key={item.idInventario}
                  sx={{ backgroundColor: inactivo ? '#ffebee' : 'inherit' }}
                >
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.laboratorio}</TableCell>
                  <TableCell align="right">
                    ${typeof item.precio === 'number' ? item.precio.toFixed(2) : 'N/A'}
                  </TableCell>

                  <TableCell align="center">
                    {isEditing ? (
                      <TextField
                        size="small"
                        type="number"
                        value={cantidadEdit}
                        onChange={(e) => setCantidadEdit(Number(e.target.value))}
                        inputProps={{ min: item.stockMinimo }}
                        sx={{ width: 120 }}
                      />
                    ) : (
                      item.cantidad
                    )}
                  </TableCell>

                  <TableCell align="center">{item.stockMinimo}</TableCell>
                  <TableCell>{item.estadoInventario}</TableCell>
                  <TableCell>
                    {item.fechaActualizacion ? new Date(item.fechaActualizacion).toLocaleString() : '—'}
                  </TableCell>

                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    {!inactivo ? (
                      <>
                        {!isEditing ? (
                          <Tooltip title="Editar cantidad">
                            <IconButton color="primary" onClick={() => startEdit(item)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip title="Guardar">
                              <IconButton color="primary" onClick={() => saveCantidad(item)}>
                                <SaveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancelar">
                              <IconButton onClick={cancelEdit}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}

                        <Tooltip title="Desactivar (lógico)">
                          <IconButton color="error" onClick={() => desactivar(item)} disabled={isEditing}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar físico (peligroso)">
                          <IconButton
                            color="error"
                            onClick={() => eliminarFisico(item)}
                            disabled={isEditing}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title="Activar inventario">
                        <IconButton color="success" onClick={() => activar(item)}>
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventarioSucursalList;
