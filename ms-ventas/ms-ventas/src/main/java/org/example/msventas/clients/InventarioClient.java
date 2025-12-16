package org.example.msventas.clients;

import org.example.msventas.models.dto.StockRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "inventario-service", url = "${inventario.url}")
public interface InventarioClient {
    @GetMapping("/inventario/{medicamentoId}/stock")
    Integer consultarStock(@PathVariable Long medicamentoId);

    @PostMapping("/inventario/descontar")
    void descontarStock(@RequestBody StockRequestDTO dto);
}
