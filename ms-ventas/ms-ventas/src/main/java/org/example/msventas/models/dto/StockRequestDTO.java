package org.example.msventas.models.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StockRequestDTO {
    @NotNull
    private Long medicamentoId;

    @NotNull
    @Min(1)
    private Integer cantidad;

    public StockRequestDTO() {
    }

    public StockRequestDTO(Long medicamentoId, Integer cantidad) {
        this.medicamentoId = medicamentoId;
        this.cantidad = cantidad;
    }

    public Long getMedicamentoId() {
        return medicamentoId;
    }

    public void setMedicamentoId(Long medicamentoId) {
        this.medicamentoId = medicamentoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}
