package org.example.msventas.controllers;

import org.example.msventas.models.dto.VentaReporteDTO;
import org.example.msventas.models.entities.Venta;
import org.example.msventas.repositories.VentaRepository;
import org.example.msventas.services.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {
    @Autowired
    private VentaService ventaRepository;

    @GetMapping("/ventas")
    public List<VentaReporteDTO> reporteVentas(
            @RequestParam(name = "desde")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate desde,

            @RequestParam(name = "hasta")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate hasta
    ) {
        return ventaRepository.obtenerVentasPorRango(desde, hasta);
    }
}
