package org.example.msventas.models.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StockRequestDTO {
    @NotNull
    private Long medicamentoId;

    @NotNull
    private Long sucursalId;

    @NotNull
    @Min(1)
    private Integer cantidad;

    public StockRequestDTO() {
    }

    // 2. CONSTRUCTOR CON PARÁMETROS (El que te falta y causó el error)
    public StockRequestDTO(Long medicamentoId, Long sucursalId, Integer cantidad) {
        this.medicamentoId = medicamentoId;
        this.sucursalId = sucursalId;
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

    public Long getSucursalId() {
        return sucursalId;
    }
    public void setSucursalId(Long sucursalId) {
        this.sucursalId = sucursalId;
    }
}
