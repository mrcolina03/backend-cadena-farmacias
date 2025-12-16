package ec.espe.msinventariov2.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class InventarioSucursalDTO {
    private Long id;

    @NotNull(message = "El ID de la sucursal no puede ser nulo")
    private Long idSucursal;

    @JsonProperty("idMedicamento")
    @NotNull(message = "El ID del medicamento no puede ser nulo")
    private Long idMedicamento;

    @NotNull(message = "La cantidad no puede ser nula")
    private Integer cantidad;

    @NotNull(message = "El stock mínimo no puede ser nulo")
    private Integer stockMinimo;

    private Date fechaActualizacion;

    private String estado; // ACTIVO o INACTIVO
}
