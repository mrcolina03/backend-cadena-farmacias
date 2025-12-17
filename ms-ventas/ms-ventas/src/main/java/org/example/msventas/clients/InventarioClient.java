package org.example.msventas.clients;

import org.example.msventas.models.dto.StockRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "inventario-service", url = "${inventario.url}")
public interface InventarioClient {
    // La ruta ahora coincide con la que pusimos en el controlador de arriba
    @GetMapping("/api/inventario/inventario-sucursal/stock/{medicamentoId}/{sucursalId}")
    Integer consultarStock(@PathVariable("medicamentoId") Long medicamentoId,
                           @PathVariable("sucursalId") Long sucursalId);

    @PostMapping("/api/inventario/inventario-sucursal/descontar")
    void descontarStock(@RequestBody StockRequestDTO dto);
}
