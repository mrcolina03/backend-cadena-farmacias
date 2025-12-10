package ec.espe.msinventario.models.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class InventarioSucursalDTO {
    private Long id;

    @NotNull(message = "El ID de la sucursal no puede ser nulo")
    private Long idSucursal;

    @NotNull(message = "El ID del medicamento no puede ser nulo")
    private Long idMedicamento;

    @NotNull(message = "La cantidad no puede ser nula")
    private Integer cantidad;

    private Date fechaActualizacion;
}
