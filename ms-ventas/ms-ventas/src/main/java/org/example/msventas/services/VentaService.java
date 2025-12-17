package org.example.msventas.services;

import org.example.msventas.clients.InventarioClient;
import org.example.msventas.exceptions.*;
import org.example.msventas.models.dto.*;
import org.example.msventas.models.entities.DetalleVenta;
import org.example.msventas.models.entities.Venta;
import org.example.msventas.repositories.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
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

        for (DetalleVentaDTO item : request.getItems()) {

            if (item.getCantidad() <= 0) {
                throw new DatosInvalidosException(
                        "Cantidad inválida para medicamento ID: " + item.getMedicamentoId()
                );
            }

            Integer stock;
            try {
                stock = inventarioClient.consultarStock(
                        item.getMedicamentoId(),
                        request.getSucursalId()
                );
            } catch (Exception e) {
                throw new ServicioExternoException("Error de conexión con el inventario");
            }

            if (stock == null || stock < item.getCantidad()) {
                throw new StockInsuficienteException(
                        "Stock insuficiente para medicamento ID: " + item.getMedicamentoId()
                );
            }

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

        Venta ventaGuardada = ventaRepository.save(venta);

        // Descuento de stock
        for (DetalleVenta item : ventaGuardada.getDetalles()) {
            try {
                inventarioClient.descontarStock(
                        new StockRequestDTO(
                                item.getMedicamentoId(),
                                ventaGuardada.getSucursalId(),
                                item.getCantidad()
                        )
                );
            } catch (Exception e) {
                throw new ServicioExternoException(
                        "Error al descontar stock: " + e.getMessage()
                );
            }
        }

        return ventaGuardada;
    }

    // ============================
    // READ ALL
    // ============================
    @Transactional(readOnly = true)
    public List<VentaResponseDTO> listarVentas() {
        return ventaRepository.findAll()
                .stream()
                .map(this::mapToVentaResponseDTO)
                .toList();
    }

    // ============================
    // READ BY ID
    // ============================
    @Transactional(readOnly = true)
    public VentaResponseDTO obtenerVenta(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Venta no encontrada"));
        return mapToVentaResponseDTO(venta);
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
    // REPORTES
    // ============================
    @Transactional(readOnly = true)
    public List<VentaReporteDTO> obtenerVentasPorRango(LocalDate desde, LocalDate hasta) {

        LocalDateTime fechaInicio = desde.atStartOfDay();
        LocalDateTime fechaFin = hasta.plusDays(1).atStartOfDay().minusNanos(1);

        return ventaRepository
                .findByFechaBetweenOrderByFechaAsc(fechaInicio, fechaFin)
                .stream()
                .map(this::mapToVentaReporteDTO)
                .toList();
    }

    // ============================
    // MAPPERS
    // ============================
    private VentaResponseDTO mapToVentaResponseDTO(Venta venta) {

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

    private VentaReporteDTO mapToVentaReporteDTO(Venta venta) {

        VentaReporteDTO dto = new VentaReporteDTO();
        dto.setId(venta.getId());
        dto.setFecha(venta.getFecha());
        dto.setClienteId(venta.getClienteId());
        dto.setSucursalId(venta.getSucursalId());
        dto.setTotal(venta.getTotal());

        return dto;
    }

    // ============================
    // UTIL
    // ============================
    private BigDecimal obtenerPrecioMedicamento(Long medicamentoId) {
        return BigDecimal.valueOf(10.00);
    }
}
