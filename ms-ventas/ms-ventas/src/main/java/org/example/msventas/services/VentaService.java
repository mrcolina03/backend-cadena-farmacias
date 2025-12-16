package org.example.msventas.services;

import org.example.msventas.clients.InventarioClient;
import org.example.msventas.exceptions.StockInsuficienteException;
import org.example.msventas.models.dto.DetalleVentaDTO;
import org.example.msventas.models.dto.VentaRequestDTO;
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

    public Venta crearVenta(VentaRequestDTO request) {

        Venta venta = new Venta();
        venta.setFecha(LocalDateTime.now());
        venta.setClienteId(request.getClienteId());
        venta.setSucursalId(request.getSucursalId());

        BigDecimal total = BigDecimal.ZERO;
        List<DetalleVenta> detalles = new ArrayList<>();

        for (DetalleVentaDTO item : request.getItems()) {

            Integer stock = inventarioClient.consultarStock(item.getMedicamentoId());

            if (stock == null || stock < item.getCantidad()) {
                throw new StockInsuficienteException(
                        "Stock insuficiente para el medicamento ID: " + item.getMedicamentoId()
                );
            }

            // ⚠️ Simulación de precio (normalmente vendría de Catálogo)
            BigDecimal precio = obtenerPrecioMedicamento(item.getMedicamentoId());

            BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(item.getCantidad()));

            DetalleVenta detalle = new DetalleVenta();
            detalle.setMedicamentoId(item.getMedicamentoId());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(precio);
            detalle.setSubtotal(subtotal);
            detalle.setVenta(venta);

            detalles.add(detalle);
            total = total.add(subtotal);
        }

        venta.setDetalles(detalles);
        venta.setTotal(total);

        return ventaRepository.save(venta);
    }

    public Venta obtenerVenta(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Venta no encontrada con id: " + id)
                );
    }

    /**
     * Simulación de obtención de precio.
     * En un sistema real, esto vendría de un MS de Catálogo.
     */
    private BigDecimal obtenerPrecioMedicamento(Long medicamentoId) {
        return BigDecimal.valueOf(10.00);
    }
}
