package ec.espe.msinventario.models.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SucursalDTO {
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede tener más de 100 caracteres")
    private String nombre;

    @Size(max = 250, message = "La dirección no puede tener más de 250 caracteres")
    private String direccion;

    @Size(max = 250, message = "La ciudad no puede tener más de 250 caracteres")
    private String ciudad;
}
