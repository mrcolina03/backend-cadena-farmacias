package org.example.msventas.controllers;

import org.example.msventas.models.dto.VentaRequestDTO;
import org.example.msventas.models.dto.VentaResponseDTO;
import org.example.msventas.models.entities.Venta;
import org.example.msventas.services.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/ventas")
public class VentaController {
    @Autowired
    private VentaService ventaService;

    // READ ALL
    @GetMapping
    public ResponseEntity<List<VentaResponseDTO>> listarVentas() {
        return ResponseEntity.ok(ventaService.listarVentas());
    }

    @PostMapping
    public ResponseEntity<Venta> crearVenta(@RequestBody VentaRequestDTO request) {
        return ResponseEntity.ok(ventaService.crearVenta(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaResponseDTO> obtenerVenta(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.obtenerVenta(id));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVenta(@PathVariable Long id) {
        ventaService.eliminarVenta(id);
        return ResponseEntity.noContent().build();
    }
}
