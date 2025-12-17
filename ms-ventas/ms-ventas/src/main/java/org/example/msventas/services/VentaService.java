package org.example.msventas.services;

import org.example.msventas.models.dto.*;
import org.springframework.transaction.annotation.Transactional;
import org.example.msventas.clients.InventarioClient;
import org.example.msventas.exceptions.DatosInvalidosException;
import org.example.msventas.exceptions.RecursoNoEncontradoException;
import org.example.msventas.exceptions.ServicioExternoException;
import org.example.msventas.exceptions.StockInsuficienteException;
import org.example.msventas.models.entities.DetalleVenta;
import org.example.msventas.models.entities.Venta;
import org.example.msventas.repositories.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private InventarioClient inventarioClient;

    // ============================
    // CREATE
    // ============================
    @Transactional
    public Venta crearVenta(VentaRequestDTO request) {

        // 🔴 Validaciones de entrada
        if (request == null) {
            throw new DatosInvalidosException("La solicitud de venta no puede ser nula");
        }

        if (request.getSucursalId() == null) {
            throw new DatosInvalidosException("La sucursal es obligatoria");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new DatosInvalidosException("La venta debe contener al menos un detalle");
        }

        Venta venta = new Venta();
        venta.setFecha(LocalDateTime.now());
        venta.setClienteId(request.getClienteId());
        venta.setSucursalId(request.getSucursalId());

        BigDecimal total = BigDecimal.ZERO;
        List<DetalleVenta> detalles = new ArrayList<>();

        // 1. Fase de Validación de Stock y Cálculo
        for (DetalleVentaDTO item : request.getItems()) {
            if (item.getCantidad() <= 0) {
                throw new DatosInvalidosException("Cantidad inválida para Medicamento ID: " + item.getMedicamentoId());
            }

            Integer stock;
            try {
                // 🟢 CORRECCIÓN: Se envía medicamentoId y sucursalId
                stock = inventarioClient.consultarStock(item.getMedicamentoId(), request.getSucursalId());
            } catch (Exception e) {
                throw new ServicioExternoException("Error de conexión con el inventario.");
            }

            if (stock == null || stock < item.getCantidad()) {
                throw new StockInsuficienteException("Stock insuficiente para Medicamento ID: " + item.getMedicamentoId());
            }

            // Simulación de precio
            BigDecimal precio = obtenerPrecioMedicamento(item.getMedicamentoId());
            BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(item.getCantidad()));

            DetalleVenta detalle = new DetalleVenta();
            detalle.setMedicamentoId(item.getMedicamentoId());
            detalle.setNombreMedicamento(item.getNombreMedicamento());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(precio);
            detalle.setSubtotal(subtotal);
            detalle.setVenta(venta);

            detalles.add(detalle);
            total = total.add(subtotal);
        }

        venta.setDetalles(detalles);
        venta.setTotal(total);

        // 2. Guardar la venta primero
        Venta ventaGuardada = ventaRepository.save(venta);

        // 3. 🚀 Fase de Descuento de Stock
        for (DetalleVenta item : ventaGuardada.getDetalles()) {
            try {
                StockRequestDTO stockRequest = new StockRequestDTO(
                        item.getMedicamentoId(),
                        ventaGuardada.getSucursalId(),
                        item.getCantidad()
                );
                // 🟢 CORRECCIÓN: Llamada para descontar el inventario real
                inventarioClient.descontarStock(stockRequest);
            } catch (Exception e) {
                throw new ServicioExternoException("Error al procesar descuento de stock: " + e.getMessage());
            }
        }

        return ventaGuardada;
    }

    // ============================
    // READ ALL
    // ============================
    @Transactional(readOnly = true)
    public List<VentaResponseDTO> listarVentas() {
        return ventaRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }



    // ============================
    // READ BY ID
    // ============================
    @Transactional(readOnly = true)
    public VentaResponseDTO obtenerVenta(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Venta no encontrada"));

        return mapToDTO(venta);
    }

    // ============================
    // DELETE
    // ============================
    public void eliminarVenta(Long id) {
        if (id == null || id <= 0) {
            throw new DatosInvalidosException("El ID de la venta no es válido");
        }

        if (!ventaRepository.existsById(id)) {
            throw new RecursoNoEncontradoException(
                    "No se puede eliminar. Venta no existe con ID: " + id
            );
        }

        ventaRepository.deleteById(id);
    }

    // ============================
    // UTIL
    // ============================
    private BigDecimal obtenerPrecioMedicamento(Long medicamentoId) {
        // Simulación de precio
        return BigDecimal.valueOf(10.00);
    }

    private VentaResponseDTO mapToDTO(Venta venta) {
        VentaResponseDTO dto = new VentaResponseDTO();
        dto.setId(venta.getId());
        dto.setFecha(venta.getFecha());
        dto.setClienteId(venta.getClienteId());
        dto.setSucursalId(venta.getSucursalId());
        dto.setTotal(venta.getTotal());

        dto.setDetalles(
                venta.getDetalles().stream().map(d -> {
                    DetalleVentaResponseDTO det = new DetalleVentaResponseDTO();
                    det.setMedicamentoId(d.getMedicamentoId());
                    det.setNombreMedicamento(d.getNombreMedicamento());
                    det.setCantidad(d.getCantidad());
                    det.setPrecioUnitario(d.getPrecioUnitario());
                    det.setSubtotal(d.getSubtotal());
                    return det;
                }).toList()
        );

        return dto;
    }
}
