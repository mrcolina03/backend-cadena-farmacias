package org.example.msventas.controllers;

import org.example.msventas.models.entities.Venta;
import org.example.msventas.repositories.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {
    @Autowired
    private VentaRepository ventaRepository;

    @GetMapping("/ventas")
    public List<Venta> reporteVentas(
            @RequestParam LocalDate desde,
            @RequestParam LocalDate hasta
    ) {
        return ventaRepository.findByFechaBetween(
                desde.atStartOfDay(),
                hasta.atTime(23,59)
        );
    }
}
