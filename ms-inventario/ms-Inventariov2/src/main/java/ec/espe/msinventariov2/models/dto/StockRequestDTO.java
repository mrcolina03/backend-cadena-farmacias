package ec.espe.msinventariov2.models.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StockRequestDTO {
    @NotNull(message = "El ID del medicamento es obligatorio")
    private Long medicamentoId;

    @NotNull(message = "El ID de la sucursal es obligatorio")
    private Long sucursalId;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;

    // Constructor vacío (Obligatorio para JSON)
    public StockRequestDTO() {
    }

    // Constructor completo (Útil para crear el objeto en el Service)
    public StockRequestDTO(Long medicamentoId, Long sucursalId, Integer cantidad) {
        this.medicamentoId = medicamentoId;
        this.sucursalId = sucursalId;
        this.cantidad = cantidad;
    }

    // Getters y Setters
    public Long getMedicamentoId() {
        return medicamentoId;
    }

    public void setMedicamentoId(Long medicamentoId) {
        this.medicamentoId = medicamentoId;
    }

    public Long getSucursalId() {
        return sucursalId;
    }

    public void setSucursalId(Long sucursalId) {
        this.sucursalId = sucursalId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}
